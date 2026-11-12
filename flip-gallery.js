(() => {
  const root = document.querySelector('[data-flip-gallery]');
  if (!root) return;
  const slides = [
    {
      image: 'flip-level-01.png',
      title: '배운 조작을 응용하는 퍼즐',
      body: '앞선 구간에서 익힌 점프와 흑백 전환을 연속해서 활용하는 퍼즐형 레벨을 설계했습니다. 개별 조작을 익히는 단계를 넘어, 상황에 맞는 전환 타이밍과 진행 방법을 스스로 판단하며 퍼즐을 해결하는 경험을 주고자 했습니다.'
    },
    {
      image: 'flip-level-02.png',
      title: '상황에 맞는 대응과 긴장감',
      body: '위험에 따라 대응 방식을 바꾸는 판단의 재미와 긴장감을 주고자 했습니다. 무조건 빠르게 움직이기보다 기다림·회피·흑백 전환을 상황에 맞게 선택하고, 예상하지 못한 변화에도 대응하며 돌파하도록 설계했습니다.'
    },
    {
      image: 'flip-level-03.png',
      title: '추격 속에서 빠르게 판단하는 전환',
      body: '뒤에서 밀려오는 장애물에 쫓기며, 흑백 전환으로 길을 열어가는 레벨을 설계했습니다. 이동하면서 전환 시점과 다음 경로를 빠르게 판단하도록 구성해, 쫓기는 긴장감과 연속된 조작으로 위기를 벗어나는 성취감을 주고자 했습니다.'
    },
    {
      image: 'flip-map.webp',
      title: '스테이지 진행 흐름과 오브젝트 배치',
      body: '구간별 난이도와 이동 흐름을 고려해 스테이지를 구성했습니다. 레벨에 필요한 오브젝트를 단계적으로 배치해 플레이가 진행되며 조작과 판단을 이어가도록 설계했습니다.'
    }
  ];
  const image = root.querySelector('[data-flip-image]');
  const title = root.querySelector('[data-flip-title]');
  const body = root.querySelector('[data-flip-body]');
  const count = root.querySelector('[data-flip-count]');
  let index = 0;
  slides.slice(1).forEach(slide => { const preload = new Image(); preload.src = slide.image; });
  function show(next) {
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    image.src = slide.image;
    image.alt = `FLIP 레벨 디자인 이미지 ${index + 1}`;
    title.textContent = slide.title;
    body.textContent = slide.body;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
  root.querySelectorAll('[data-flip-step]').forEach(button => {
    button.addEventListener('click', () => show(index + Number(button.dataset.flipStep)));
  });
  root.querySelector('[data-flip-zoom]').addEventListener('click', () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'flip-image-dialog';
    const full = document.createElement('img');
    full.src = slides[index].image;
    full.alt = image.alt;
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', '이미지 닫기');
    close.textContent = '×';
    close.addEventListener('click', () => dialog.close());
    dialog.append(close, full);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => dialog.remove());
    document.body.append(dialog);
    dialog.showModal();
  });
  document.addEventListener('keydown', event => {
    if (!dialogOpen() && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      const rect = root.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  function dialogOpen() { return !!document.querySelector('.flip-image-dialog[open]'); }
})();
