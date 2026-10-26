(() => {
  const root = document.querySelector('.hero-showcase');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll('.showcase-card'));
  const dots = Array.from(root.querySelectorAll('[data-slide]'));
  const counter = root.querySelector('.showcase-counter');
  const status = root.querySelector('.showcase-status');
  const stack = root.querySelector('.showcase-stack');
  if (!cards.length) return;
  let current = 0;
  let gesture = null;

  function select(index) {
    current = ((index % cards.length) + cards.length) % cards.length;
    const next = (current + 1) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === current);
      card.classList.toggle('is-next', cards.length > 1 && i === next);
      card.setAttribute('aria-hidden', String(i !== current));
      if (i === current || i === next) {
        card.querySelector('img').loading = 'eager';
      }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-pressed', String(i === current));
    });
    counter.replaceChildren();
    const number = document.createElement('b');
    number.textContent = String(current + 1).padStart(2, '0');
    counter.append(number, ` / ${String(cards.length).padStart(2, '0')}`);
    status.textContent = cards[current].getAttribute('aria-label');
  }

  root.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => select(current + Number(button.dataset.direction)));
  });
  dots.forEach(dot => dot.addEventListener('click', () => select(Number(dot.dataset.slide))));
  root.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    select(current + (event.key === 'ArrowRight' ? 1 : -1));
  });

  stack.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    stack.setPointerCapture(event.pointerId);
  });
  stack.addEventListener('pointerup', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      select(current + (dx < 0 ? 1 : -1));
    }
  });
  stack.addEventListener('pointercancel', () => { gesture = null; });
  stack.addEventListener('lostpointercapture', () => { gesture = null; });
  select(0);
})();
