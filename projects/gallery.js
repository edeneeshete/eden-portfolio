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
  
    let currentIndex = 0;
    let naturalWidth = 0;
    let naturalHeight = 0;
  
    // ---------- OPEN LIGHTBOX ----------
    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentIndex = index;
        lightbox.classList.add('open');
        showImage();
      });
    });
  
    function showImage() {
      const currentImg = images[currentIndex];
      lightboxImage.src = currentImg.src;
      captionEl.textContent = currentImg.alt || "";
  
      lightboxImage.onload = () => {
        naturalWidth = lightboxImage.naturalWidth;
        naturalHeight = lightboxImage.naturalHeight;
  
        zoomBox.style.backgroundImage = `url(${lightboxImage.src})`;
        zoomBox.style.backgroundSize = `${naturalWidth}px ${naturalHeight}px`;
      };
    }
  
    // ---------- NAV ----------
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage();
    }
  
    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage();
    }
  
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
  
    // ---------- CLOSE ----------
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });
  
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });
  
    // ---------- KEYBOARD ----------
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
  
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  
    // ---------- ZOOM ----------
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
  });
  