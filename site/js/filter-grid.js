/**
 * Filterable Feature Grid
 * Tabs: All, Front, Sides and rear, Parking, Speed and signs, Cloud
 */

export function initFilterGrid() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.feature-card-wrapper');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      // Update active tab state
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category || cardCategory.includes(category)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
