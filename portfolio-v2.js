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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function requestPlayback(video) {
  video.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
  video.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
}

function pausePlayback(video) {
  video.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
}

frames.forEach(frame => {
  frame.querySelector('iframe')?.addEventListener('load', event => {
    if (frame.classList.contains('is-active')) requestPlayback(event.currentTarget);
  });
});

function showSlide(index) {
  activeSlide = (index + portfolioSlides.length) % portfolioSlides.length;
  const slide = portfolioSlides[activeSlide];
  frames.forEach((frame, frameIndex) => {
    const isActive = frameIndex === activeSlide;
    frame.classList.toggle('is-active', isActive);
    const video = frame.querySelector('iframe');
    if (video) {
      if (isActive) {
        requestPlayback(video);
        window.setTimeout(() => { if (frame.classList.contains('is-active')) requestPlayback(video); }, 1200);
      } else pausePlayback(video);
    }
  });
  hero.classList.toggle('has-video', Boolean(frames[activeSlide].querySelector('iframe')));
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
  const video = frames[activeSlide].querySelector('iframe');
  if (video) requestPlayback(video);
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
