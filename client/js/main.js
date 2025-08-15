// Make navbar solid after scroll
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

// Reveal elements on intersection
(function(){
  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('show'));
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
  els.forEach(el => io.observe(el));
})();

