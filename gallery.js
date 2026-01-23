document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // SELECT ALL ITEMS
  // ------------------------------
  const allItems = Array.from(document.querySelectorAll('.item.animated'));

  // ------------------------------
  // HOVER ANIMATION
  // ------------------------------
  allItems.forEach(item => {
    const img = item.querySelector('img');
    const images = item.dataset.images.split(',');
    let hoverIndex = 0;
    let interval = null;
    const originalSrc = img.src;

    // Preload images
    images.forEach(src => new Image().src = `images/${src}`);

    // Hover animation
    item.addEventListener('mouseenter', () => {
      if (interval) return;
      interval = setInterval(() => {
        img.src = `images/${images[hoverIndex]}`;
        hoverIndex = (hoverIndex + 1) % images.length;
      }, 1000);
    });

    item.addEventListener('mouseleave', () => {
      clearInterval(interval);
      interval = null;
      hoverIndex = 0;
      img.src = originalSrc;
    });
  });

  // ------------------------------
  // GALLERY TEXT SPACING (SPACE-BLOCKS)
  // ------------------------------
  const galleryTexts = document.querySelectorAll('.gallery-text');
  galleryTexts.forEach(container => {
    container.querySelectorAll('p').forEach(p => {
      p.innerHTML = p.textContent.replace(/ /g, '<span class="space-block"></span>');
    });
  });

});
