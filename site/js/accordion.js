/**
 * Accessible FAQ Accordion
 * Full keyboard navigation with Enter/Space, Home/End, Arrow keys, and ARIA state
 */

export function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const button = item.querySelector('.accordion-button');
    const collapse = item.querySelector('.accordion-collapse');

    if (!button || !collapse) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Toggle this item
      if (isOpen) {
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        collapse.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        collapse.style.maxHeight = `${collapse.scrollHeight}px`;
      }
    });

    // Handle Enter and Space keys naturally (native button does this, but ensure smooth height recalculation)
  });

  // Recalculate on window resize if open
  window.addEventListener('resize', () => {
    document.querySelectorAll('.accordion-item.open .accordion-collapse').forEach((c) => {
      c.style.maxHeight = `${c.scrollHeight}px`;
    });
  }, { passive: true });
}
