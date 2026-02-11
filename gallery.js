document.addEventListener('DOMContentLoaded', () => {

  // ================================
  // GALLERY IMAGE HOVER (UNCHANGED)
  // ================================
  const allItems = Array.from(document.querySelectorAll('.item.animated'));

  allItems.forEach(item => {
    const img = item.querySelector('img');
    const images = item.dataset.images.split(',');
    let hoverIndex = 0;
    let interval = null;
    const originalSrc = img.src;

    images.forEach(src => new Image().src = `images/${src}`);

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

  // ================================
  // SPACE-BLOCK REPLACEMENT (UNCHANGED)
  // ================================
  document.querySelectorAll('.gallery-text p').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/ /g, '<span class="space-block"></span>');
  });

  // ================================
  // MAGNETIC LETTER REPULSION
  // + per-letter mass
  // + staggered return
  // ================================
  const spaceText = document.querySelector('.space-text');
  if (spaceText) {  // note: changed from if (!spaceText) return; so rest still runs
    // Wrap each visible character in a span
    const walker = document.createTreeWalker(spaceText, NodeFilter.SHOW_TEXT);
    let node;
    const textNodes = [];

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const frag = document.createDocumentFragment();

      [...textNode.textContent].forEach(char => {
        if (char === ' ') {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = char;

          // 🔹 per-letter "mass"
          span.dataset.mass = (0.3 + Math.random()*3).toFixed(2);

          frag.appendChild(span);
        }
      });

      textNode.parentNode.replaceChild(frag, textNode);
    });

    spaceText.addEventListener('mousemove', e => {
      spaceText.querySelectorAll('.letter').forEach(letter => {
        const rect = letter.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        const force = Math.max(0, 1500 - distance) / 1500;
        const mass = parseFloat(letter.dataset.mass);

        letter.style.transition = 'transform 0.15s ease-out';

        letter.style.transform = `
          translate(
            ${dx * force * -0.35 / mass}px,
            ${dy * force * -0.35 / mass}px
          )
        `;
      });
    });

    spaceText.addEventListener('mouseleave', () => {
      spaceText.querySelectorAll('.letter').forEach(letter => {
        const delay = Math.random() * 200;
        letter.style.transition = `transform 0.6s ease-out ${delay}ms`;
        letter.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ================================
  // DESKTOP-FIRST WARNING
  // ================================
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

  if (isMobileOrTablet) {
    // Create overlay
    const warning = document.createElement('div');
    warning.id = 'mobile-warning';
    warning.style.cssText = `
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background: rgba(255,255,255,0.95);
      display:flex;
      justify-content:center;
      align-items:center;
      text-align:center;
      flex-direction: column;
      z-index: 9999;
      padding: 20px;
      font-family: sans-serif;
    `;
    warning.innerHTML = `
      <h1 style="margin-bottom:20px; color:black;">
        For the best experience, view this website on a desktop.
      </h1>
      <button id="continue-mobile" style="
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border: none;
        background: black;
        color: white;
        border-radius: 4px;
      ">Continue on Mobile</button>
    `;
    document.body.appendChild(warning);

    document.getElementById('continue-mobile').addEventListener('click', () => {
      warning.style.display = 'none';
    });
  }

});
