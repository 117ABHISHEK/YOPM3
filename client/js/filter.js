document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterButtons.length || !productCards.length) {
    return; // No filters or products on the page
  }

  const handleFilter = (e) => {
    const selectedFilter = e.target.dataset.filter;

    // Update the active state on buttons
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === selectedFilter);
    });

    // Show or hide product cards based on the filter
    productCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = selectedFilter === 'all' || selectedFilter === cardCategory;
      card.style.display = shouldShow ? '' : 'none';
    });
  };

  filterButtons.forEach(button => button.addEventListener('click', handleFilter));
});

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("productsGrid");
    const items = Array.from(grid.children);

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      grid.appendChild(items[j]); // re-append shuffled element
      items.splice(j, 1); // remove from pool
    }
  });