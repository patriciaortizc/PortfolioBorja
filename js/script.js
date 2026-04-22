const hamburger = document.getElementById('hamburger');
const menu      = document.querySelector('.menu');

if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  // Cierra el menú al pulsar un enlace (mobile)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {

  const video   = document.getElementById('heroVideo');
  const content = document.getElementById('heroContent');
  const image   = document.querySelector('.hero-img');
  const hero    = document.getElementById('hero');

  if (!video || !hero) return;   // sale si no hay hero en la página

  let activated = false;
  video.muted      = true;
  video.playsInline = true;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 10 && !activated) {
      activated = true;
      content.style.opacity   = '0';
      content.style.transform = 'translateY(-20px)';
      image.style.opacity     = '0';
      video.style.opacity     = '1';
      video.play().catch(err => console.log(err));
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

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.card').forEach(card => {
    const vid = card.querySelector('video');
    if (!vid) return;

    card.addEventListener('mouseenter', () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      vid.pause();
    });
  });

});

document.addEventListener('DOMContentLoaded', () => {

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

});

document.addEventListener('DOMContentLoaded', () => {

  const input = document.querySelector('#telefono');
  if (!input || typeof intlTelInput === 'undefined') return;

  intlTelInput(input, {
    initialCountry: 'auto',
    autoPlaceholder: 'off',
    geoIpLookup: function (callback) {
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback('ES'));
    },
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
  });

});

const video = document.getElementById('heroVideo');

video.addEventListener('canplay', () => {
  video.classList.add('ready');
});