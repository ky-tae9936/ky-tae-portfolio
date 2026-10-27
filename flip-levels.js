(() => {
  const root = document.querySelector('.flip-level-notes');
  if (!root) return;
  const levels = [{"title": "배운 조작을 응용하는 퍼즐", "body": "앞선 구간에서 익힌 점프와 흑백 전환을 연속해서 활용하는 퍼즐형 레벨을 설계했습니다. 개별 조작을 익히는 단계를 넘어, 상황에 맞는 전환 타이밍과 진행 방법을 스스로 판단하며 퍼즐을 해결하는 경험을 주고자 했습니다.", "image": "flip-level-01.png"}, {"title": "상황에 맞는 대응과 긴장감", "body": "위험에 따라 대응 방식을 바꾸는 판단의 재미와 긴장감을 주고자 했습니다. 무조건 빠르게 움직이기보다 기다림·회피·흑백 전환을 상황에 맞게 선택하고, 예상하지 못한 변화에도 대응하며 돌파하도록 설계했습니다.", "image": "flip-level-02.png"}, {"title": "추격 속에서 빠르게 판단하는 전환", "body": "뒤에서 밀려오는 장애물에 쫓기며, 흑백 전환으로 길을 열어가는 레벨을 설계했습니다. 이동하면서 전환 시점과 다음 경로를 빠르게 판단하도록 구성해, 쫓기는 긴장감과 연속된 조작으로 위기를 벗어나는 성취감을 주고자 했습니다.", "image": "flip-level-03.png"}];
  const imageButton = root.querySelector('.flip-level-image');
  const image = imageButton.querySelector('img');
  let index = 0;

  const copy = root.querySelector('.flip-level-copy');
  let measuredWidth = -1;
  function reserveCopyHeight(force = false) {
    const width = copy.getBoundingClientRect().width;
    if (!width || (!force && Math.abs(width - measuredWidth) < 0.5)) return;
    measuredWidth = width;
    let tallest = 0;
    levels.forEach(level => {
      const probe = copy.cloneNode(true);
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:${width}px;min-height:0;height:auto;left:0;top:0;`;
      probe.querySelector('[data-level-title]').textContent = level.title;
      probe.querySelector('[data-level-body]').textContent = level.body;
      root.append(probe);
      tallest = Math.max(tallest, probe.getBoundingClientRect().height);
      probe.remove();
    });
    copy.style.minHeight = `${Math.ceil(tallest)}px`;
  }
  reserveCopyHeight();
  new ResizeObserver(() => reserveCopyHeight()).observe(copy);
  if (document.fonts) document.fonts.ready.then(() => reserveCopyHeight(true));

  // Preload the next maps; the current image's natural ratio determines its height.
  levels.slice(1).forEach(level => { const img = new Image(); img.src = level.image; });
  function select(next) {
    index = (next + levels.length) % levels.length;
    const level = levels[index];
    const number = String(index + 1).padStart(2, '0');
    image.src = level.image;
    image.alt = `FLIP 레벨 ${number} 전체 맵`;
    imageButton.dataset.zoom = level.image;
    imageButton.setAttribute('aria-label', `레벨 ${number} 전체 맵 확대`);
    root.querySelector('[data-level-label]').textContent = `LEVEL ${number}`;
    root.querySelector('[data-level-title]').textContent = level.title;
    root.querySelector('[data-level-body]').textContent = level.body;
    root.querySelector('.flip-level-count').replaceChildren(Object.assign(document.createElement('b'), { textContent: number }), document.createTextNode(` / ${String(levels.length).padStart(2, '0')}`));
  }
  root.querySelectorAll('[data-level-step]').forEach(button => button.addEventListener('click', () => select(index + Number(button.dataset.levelStep))));
  root.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
})();
