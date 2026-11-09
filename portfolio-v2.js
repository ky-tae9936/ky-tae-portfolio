const portfolioSlides = [
  { type: 'TEAM PROJECT · 2025', title: 'FLIP ↗', detail: '레벨 디자인 · 에셋·사운드 리서치 · Unity', href: '#team' },
  { type: 'PERSONAL PORTFOLIO', title: '액션 RPG 레벨 디자인 ↗', detail: '동선 · 전투 학습 · 적 배치 · 작업 영상', href: '#personal' },
  { type: 'AI PRACTICE', title: '플레이어 공격 콤보 테스트 ↗', detail: '공격 입력과 애니메이션 연결 · AI 활용', href: '#ai' }
];

const hero = document.querySelector('.hero');
const frames = Array.from(document.querySelectorAll('.hero-frame'));
const slideType = document.querySelector('#hero-type');
const slideTitle = document.querySelector('#hero-title');
const slideDetail = document.querySelector('#hero-detail');
const slideCount = document.querySelector('#hero-count');
const slideProgress = document.querySelector('.hero-progress i');
let activeSlide = 0;
let carouselTimer;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showSlide(index) {
  activeSlide = (index + portfolioSlides.length) % portfolioSlides.length;
  const slide = portfolioSlides[activeSlide];
  frames.forEach((frame, frameIndex) => {
    const isActive = frameIndex === activeSlide;
    frame.classList.toggle('is-active', isActive);
    const video = frame.querySelector('iframe');
    if (video) {
      if (isActive && video.dataset.src) video.src = video.dataset.src;
      if (!isActive && video.src) {
        video.dataset.src = video.src;
        video.removeAttribute('src');
      }
    }
  });
  slideType.textContent = slide.type;
  slideTitle.textContent = slide.title;
  slideTitle.href = slide.href;
  slideDetail.textContent = slide.detail;
  slideCount.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(portfolioSlides.length).padStart(2, '0')}`;
  slideProgress.style.transform = `translateX(${activeSlide * 100}%)`;
}

function stopCarousel() { window.clearInterval(carouselTimer); }
function startCarousel() {
  stopCarousel();
  if (!reduceMotion.matches && !document.hidden) carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 9000);
}

document.querySelector('#hero-prev').addEventListener('click', () => { showSlide(activeSlide - 1); startCarousel(); });
document.querySelector('#hero-next').addEventListener('click', () => { showSlide(activeSlide + 1); startCarousel(); });
hero.addEventListener('mouseenter', stopCarousel);
hero.addEventListener('mouseleave', startCarousel);
hero.addEventListener('focusin', stopCarousel);
hero.addEventListener('focusout', startCarousel);
document.addEventListener('visibilitychange', startCarousel);
reduceMotion.addEventListener('change', startCarousel);
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
