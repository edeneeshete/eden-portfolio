document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const images = document.querySelectorAll('.lightbox-img');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const zoomWrapper = lightbox.querySelector('.lightbox-zoom-wrapper');
  const zoomBox = lightbox.querySelector('.zoom-preview');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const counter = lightbox.querySelector('.lightbox-counter');

  let currentIndex = 0;
  let naturalWidth = 0;
  let naturalHeight = 0;

  /* ---------- COUNTER ---------- */
  function updateCounter() {
    if (!counter) return;
    counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${images.length}`;
  }

  /* ---------- OPEN LIGHTBOX ---------- */
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      lightbox.classList.add('open');
      showImage();
      updateCounter();
    });
  });

  function showImage() {
    const currentImg = images[currentIndex];
    lightboxImage.src = currentImg.src;

    // ALT-based caption still set, but harmless if hidden
    if (captionEl) captionEl.textContent = currentImg.alt || "";

    lightboxImage.onload = () => {
      naturalWidth = lightboxImage.naturalWidth;
      naturalHeight = lightboxImage.naturalHeight;

      zoomBox.style.backgroundImage = `url(${lightboxImage.src})`;
      zoomBox.style.backgroundSize = `${naturalWidth}px ${naturalHeight}px`;
    };
  }

  /* ---------- NAV ---------- */
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
    updateCounter();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
    updateCounter();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  /* ---------- CLOSE ---------- */
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
    }
  });

  /* ---------- KEYBOARD ---------- */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });

  /* ---------- ZOOM ---------- */
  if (zoomWrapper) {
    zoomWrapper.addEventListener('mouseenter', () => {
      zoomBox.style.display = 'block';
    });

    zoomWrapper.addEventListener('mouseleave', () => {
      zoomBox.style.display = 'none';
    });

    zoomWrapper.addEventListener('mousemove', (e) => {
      if (!naturalWidth || !naturalHeight) return;

      const rect = lightboxImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const scaleX = naturalWidth / rect.width;
      const scaleY = naturalHeight / rect.height;

      const bgX = -(x * scaleX) + zoomBox.offsetWidth / 2;
      const bgY = -(y * scaleY) + zoomBox.offsetHeight / 2;

      zoomBox.style.backgroundPosition = `${bgX}px ${bgY}px`;
    });
  }

});
