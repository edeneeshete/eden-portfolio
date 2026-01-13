// Select all animated gallery items
const animatedItems = document.querySelectorAll('.item.animated');

animatedItems.forEach(item => {
  const img = item.querySelector('img');
  const images = item.dataset.images.split(',');
  let index = 0;
  let interval = null;

  // ---- PRELOAD IMAGES ----
  images.forEach(src => {
    const preloadedImg = new Image();
    preloadedImg.src = `images/${src}`;
  });

  // ---- START ANIMATION ON HOVER ----
  item.addEventListener('mouseenter', () => {
    if (interval) return; // prevent stacking intervals

    interval = setInterval(() => {
      index = (index + 1) % images.length;
      img.src = `images/${images[index]}`;
    }, 1000); // speed in ms
  });

  // ---- STOP ANIMATION ----
  item.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = null;
    index = 0;
    img.src = `images/${images[0]}`; // reset to first frame
  });
});
