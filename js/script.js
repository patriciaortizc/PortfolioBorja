
function isMobile() {
  return window.innerWidth <= 768;
}

function findCentered(cards) {
  const center = window.innerWidth / 2;
  let closest = null, minDist = Infinity;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const dist = Math.abs(rect.left + rect.width / 2 - center);
    if (dist < minDist) { minDist = dist; closest = card; }
  });
  return closest;
}

function applyCentered(cards, closest) {
  cards.forEach(card => {
    const vid = card.querySelector('video');
    if (card === closest) {
      card.classList.add('is-centered');
      vid?.play().catch(() => {});
    } else {
      card.classList.remove('is-centered');
      if (vid) { vid.pause(); vid.currentTime = 0; }
    }
  });
}

function addHoverVideo(container, selector) {
  container.querySelectorAll(selector).forEach(card => {
    const vid = card.querySelector('video');
    if (!vid || isMobile()) return;
    card.addEventListener('mouseenter', () => { vid.currentTime = 0; vid.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => vid.pause());
  });
}

function addScrollCentered(container, selector, delay = 100) {
  function update() {
    const cards = container.querySelectorAll(selector);
    if (cards.length) applyCentered(cards, findCentered(cards));
  }
  container.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', () => setTimeout(update, 300));
  setTimeout(update, delay);
}


// HAMBURGER
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const menu      = document.querySelector('.menu');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', () => menu.classList.toggle('active'));
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('active'));
  });
});


// HERO
document.addEventListener('DOMContentLoaded', () => {
  const video   = document.getElementById('heroVideo');
  const content = document.getElementById('heroContent');
  const image   = document.querySelector('.hero-img');
  const hero    = document.getElementById('hero');
  if (!video || !hero) return;

  let activated = false;
  video.muted = true;
  video.playsInline = true;
  video.addEventListener('canplay', () => video.classList.add('ready'));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10 && !activated) {
      activated = true;
      content.style.opacity   = '0';
      content.style.transform = 'translateY(-20px)';
      image.style.opacity     = '0';
      video.style.opacity     = '1';
      video.play().catch(() => {});
    }
  });

  hero.addEventListener('click', () => {
    if (!activated) return;
    video.pause();
    video.currentTime       = 0;
    image.style.opacity     = '1';
    video.style.opacity     = '0';
    content.style.opacity   = '1';
    content.style.transform = 'translateY(0)';
    activated = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
});


// FORMULARIO
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
});


// INTL TEL INPUT
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#telefono');
  if (!input || typeof intlTelInput === 'undefined') return;
  intlTelInput(input, {
    initialCountry: 'auto',
    autoPlaceholder: 'off',
    geoIpLookup: callback => {
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback('ES'));
    },
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
  });
});


// INDEX: .mtg-card
document.addEventListener('DOMContentLoaded', () => {
  const scrollWrapper = document.querySelector('.cards-scroll-wrapper');
  if (!scrollWrapper) return;

  document.querySelector('.scroll-btn.left')?.addEventListener('click', () => {
    scrollWrapper.scrollBy({ left: -320, behavior: 'smooth' });
  });
  document.querySelector('.scroll-btn.right')?.addEventListener('click', () => {
    scrollWrapper.scrollBy({ left: 320, behavior: 'smooth' });
  });

  addHoverVideo(scrollWrapper, '.mtg-card');
  if (isMobile()) addScrollCentered(scrollWrapper, '.mtg-card:not(.hidden)');
});

// Filtros — función global para onclick en HTML 
function filterCards(type, btn) {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.mtg-card').forEach(card => {
    card.classList.toggle('hidden', type !== 'all' && card.dataset.type !== type);
  });
  if (!isMobile()) return;
  const scrollWrapper = document.querySelector('.cards-scroll-wrapper');
  if (!scrollWrapper) return;
  const cards = scrollWrapper.querySelectorAll('.mtg-card:not(.hidden)');
  if (cards.length) applyCentered(cards, findCentered(cards));
}


// WORK .work-card
document.addEventListener('DOMContentLoaded', () => {
  const scrollWork = document.getElementById('scrollWork');
  if (!scrollWork) return;
  addHoverVideo(scrollWork, '.work-card');
  if (isMobile()) addScrollCentered(scrollWork, '.work-card');
});


// WORK-PROFESSIONAL y WORK-PERSONAL: .project-card 
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.pro-grid') || document.querySelector('.per-grid');
  if (!grid) return;

  addHoverVideo(grid, '.project-card');
  if (isMobile()) addScrollCentered(grid, '.project-card');
});


// MODAL DE VÍDEO (project-card)
document.addEventListener('DOMContentLoaded', () => {
  const modal      = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn   = document.getElementById('closeModal');
  if (!modal || !modalVideo || !closeBtn) return;

  function closeVideo() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.querySelector('video source')?.src;
      if (!src) return;
      modalVideo.src = src;
      modal.classList.add('active');
      modalVideo.play();
    });
  });

  closeBtn.addEventListener('click', closeVideo);
  modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
});

// SORT PROJECT CARDS (PRO + PERSONAL)
document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;

  const grid = document.querySelector('.pro-grid') || document.querySelector('.per-grid');
  if (!grid) return;

  function sortCards(order) {
    const cards = Array.from(grid.querySelectorAll('.project-card'));

    cards.sort((a, b) => {
      const dateA = parseInt(a.getAttribute('data-date'), 10);
      const dateB = parseInt(b.getAttribute('data-date'), 10);
      return order === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    for (let i = cards.length - 1; i >= 0; i--) {
      grid.insertBefore(cards[i], grid.firstChild);
    }
  }

  sortSelect.addEventListener('input', (e) => sortCards(e.target.value));
  sortSelect.addEventListener('change', (e) => sortCards(e.target.value));

  sortCards(sortSelect.value);
});