const portfolioSlides = [
  { type: 'TEAM PROJECT · 2025', title: 'FLIP ↗', detail: '레벨 디자인 · 에셋·사운드 리서치 · Unity', href: 'team.html' },
  { type: 'PERSONAL PORTFOLIO · 01', title: '액션 RPG 레벨 디자인 ↗', detail: '동선 · 전투 학습 · 적 배치 · 작업 영상', href: 'personal.html#level' },
  { type: 'PERSONAL PORTFOLIO · 02', title: '보스 몬스터 전투 기획 ↗', detail: '로스트아크 · 패턴과 대응 설계 · PDF 기획서', href: 'personal.html#boss' },
  { type: 'PERSONAL PORTFOLIO · 03', title: '일반 몬스터 AI 기획 ↗', detail: '로스트아크 · 상태 전환과 행동 규칙 · PDF 기획서', href: 'personal.html#monster' },
  { type: 'AI PRACTICE · 01', title: '몬스터 AI 시뮬레이터 ↗', detail: '대기 · 추격 · 공격 · 복귀 상태 검증', href: 'ai.html#simulator' },
  { type: 'AI PRACTICE · 02', title: '플레이어 공격 콤보 테스트 ↗', detail: '공격 입력과 애니메이션 연결 · AI 활용', href: 'ai.html#combo' }
];

const hero = document.querySelector('.hero');
const frames = Array.from(document.querySelectorAll('.hero-frame'));
const slideType = document.querySelector('#hero-type');
const slideTitle = document.querySelector('#hero-title');
const slideDetail = document.querySelector('#hero-detail');
const slideCount = document.querySelector('#hero-count');
const slideProgress = document.querySelector('.hero-progress i');
const playButton = document.querySelector('#hero-play');
let activeSlide = 0;
let carouselTimer;
let documentPageTimer;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const youtubePlayers = new Map();
const lastVideoStarts = new Map();

function playRandomExcerpt(index) {
  const player = youtubePlayers.get(index);
  if (!player || index !== activeSlide) return;
  const duration = player.getDuration();
  if (!duration) {
    window.setTimeout(() => playRandomExcerpt(index), 500);
    return;
  }
  const first = Math.min(8, Math.max(0, duration - 2));
  const last = Math.max(first, duration - 6);
  let start = first + Math.random() * (last - first);
  const previous = lastVideoStarts.get(index);
  if (last - first > 20 && previous !== undefined && Math.abs(start - previous) < 12) {
    start = start + (last - first) / 2;
    if (start > last) start = first + (start - last);
  }
  lastVideoStarts.set(index, start);
  player.mute();
  player.seekTo(start, true);
  window.setTimeout(() => {
    if (index === activeSlide) player.playVideo();
  }, 180);
}

function requestPlayback(index) {
  const player = youtubePlayers.get(index);
  if (!player) return;
  player.mute();
  playRandomExcerpt(index);
}

function startDocumentSequence(frame) {
  const spreads = Array.from(frame.querySelectorAll('.hero-doc-spread'));
  if (!spreads.length) return;
  let currentSpread = 0;
  const showSpread = () => spreads.forEach((spread, index) => spread.classList.toggle('is-current', index === currentSpread));
  showSpread();
  if (spreads.length < 2) return;
  documentPageTimer = window.setInterval(() => {
    currentSpread = (currentSpread + 1) % spreads.length;
    showSpread();
  }, 2600);
}

window.onYouTubeIframeAPIReady = () => {
  frames.forEach((frame, index) => {
    const mount = frame.querySelector('.hero-youtube');
    if (!mount) return;
    const videoId = mount.dataset.videoId;
    const player = new YT.Player(mount, {
      videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 0, controls: 0, disablekb: 1, playsinline: 1,
        modestbranding: 1, rel: 0, iv_load_policy: 3, origin: location.origin
      },
      events: {
        onReady(event) {
          youtubePlayers.set(index, event.target);
          event.target.mute();
          if (index === activeSlide) playRandomExcerpt(index);
        }
      }
    });
    youtubePlayers.set(index, player);
  });
};

const youtubeApi = document.createElement('script');
youtubeApi.src = 'https://www.youtube.com/iframe_api';
document.head.append(youtubeApi);

function showSlide(index) {
  window.clearInterval(documentPageTimer);
  activeSlide = (index + portfolioSlides.length) % portfolioSlides.length;
  const slide = portfolioSlides[activeSlide];
  frames.forEach((frame, frameIndex) => {
    const isActive = frameIndex === activeSlide;
    frame.classList.toggle('is-active', isActive);
    if (isActive && frame.querySelector('.hero-doc-preview')) startDocumentSequence(frame);
    const videoIndex = frame.querySelector('.hero-youtube') ? frameIndex : -1;
    if (videoIndex >= 0) {
      if (isActive) {
        requestPlayback(videoIndex);
      } else youtubePlayers.get(videoIndex)?.pauseVideo();
    }
  });
  hero.classList.toggle('has-video', Boolean(frames[activeSlide].querySelector('.hero-youtube')));
  hero.classList.toggle('has-document', activeSlide === 2 || activeSlide === 3);
  slideType.textContent = slide.type;
  slideTitle.textContent = slide.title;
  slideTitle.href = slide.href;
  slideDetail.textContent = slide.detail;
  slideCount.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(portfolioSlides.length).padStart(2, '0')}`;
  slideProgress.style.animation = 'none';
  void slideProgress.offsetWidth;
  slideProgress.style.animation = '';
}

function stopCarousel() { window.clearInterval(carouselTimer); }
function startCarousel() {
  stopCarousel();
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 8000);
}

document.querySelector('#hero-prev').addEventListener('click', () => { showSlide(activeSlide - 1); startCarousel(); });
document.querySelector('#hero-next').addEventListener('click', () => { showSlide(activeSlide + 1); startCarousel(); });
playButton.addEventListener('click', () => {
  if (frames[activeSlide].querySelector('.hero-youtube')) requestPlayback(activeSlide);
});
document.addEventListener('visibilitychange', startCarousel);
showSlide(0);
startCarousel();

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  siteNav.classList.toggle('is-open', !isOpen);
});
siteNav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    siteNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
  }
});

