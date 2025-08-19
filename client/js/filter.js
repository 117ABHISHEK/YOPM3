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