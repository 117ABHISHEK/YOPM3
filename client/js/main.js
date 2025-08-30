// Navbar: make solid after scroll
(function(){
  const nav = document.getElementById('siteNav');
  const solidClass = 'nav-solid';
  const onScroll = () => {
    const threshold = 80;
    if (window.scrollY > threshold) nav.classList.add(solidClass);
    else nav.classList.remove(solidClass);
  };
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });
})();

// Brand intro animation
(function(){
  const intro = document.getElementById('brandIntro');
  const navBrand = document.querySelector('.navbar-brand');

  if (!intro || !navBrand) return;

  window.addEventListener('load', () => {
    // Show intro
    intro.classList.add('active');

    setTimeout(() => {
      // Animate intro to shrink and move towards navbar brand
      intro.classList.add('shrink');

      // Reveal navbar after intro shrinks
      setTimeout(() => {
        intro.style.display = 'none';
        document.body.classList.add('content-ready');
      }, 1600); // match CSS transition duration
    }, 1400); // delay before shrink
  });
})();

// Reveal on intersection (fade-up)
(function(){
  const els = document.querySelectorAll('.fade-up');


  function revealNow() {
    els.forEach(el => el.classList.add('show'));
  }

  if (!('IntersectionObserver' in window)) {
    revealNow();
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  // Delay fade-up until intro finished
  window.addEventListener('load', () => {
    // If there's an intro, wait for it to finish. Otherwise, start right away.
    const delay = intro ? 3000 : 0;

    setTimeout(() => {
      if (document.body.classList.contains('content-ready')) {
        els.forEach(el => io.observe(el));
      }
    }, delay);
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const productModal = document.getElementById('productModal');

  productModal.addEventListener('show.bs.modal', (event) => {
    // Get the button that triggered the modal
    const button = event.relatedTarget;
    // Find the parent card element
    const card = button.closest('.product-card');

    // Get the product details from the card
    const imageSrc = card.querySelector('.card-img-top').src;
    const title = card.querySelector('.card-title').textContent;
    const description = card.querySelector('.card-text').textContent;

    // Get the modal's elements
    const modalImage = productModal.querySelector('#modal-product-image');
    const modalTitle = productModal.querySelector('#modal-product-title');
    const modalDescription = productModal.querySelector('#modal-product-description');

    // Populate the modal with the new content
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
  });
});