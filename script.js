const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.scroll-progress');
const glow = document.querySelector('.cursor-glow');
const heroVisual = document.querySelector('.hero-visual');

const closeMenu = () => {
  navLinks?.classList.remove('active');
  menuBtn?.classList.remove('active');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

const toggleMenu = () => {
  const isOpen = navLinks?.classList.toggle('active');
  menuBtn?.classList.toggle('active', isOpen);
  menuBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.classList.toggle('menu-open', isOpen);
};

menuBtn?.addEventListener('click', toggleMenu);

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 920) closeMenu();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');

    if (entry.target.classList.contains('stagger-group')) {
      entry.target.querySelectorAll('.stagger-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        item.classList.add('show');
      });
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal, .reveal-scale, .stagger-group').forEach(element => observer.observe(element));

if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  header?.classList.toggle('scrolled', scrollTop > 24);

  if (heroVisual) {
    if (window.innerWidth > 920) {
      heroVisual.style.transform = `translateY(${scrollTop * 0.06}px)`;
    } else {
      heroVisual.style.transform = '';
    }
  }
};

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const setActiveNav = () => {
  let current = 'home';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });

  navAnchors.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.animated) return;
    entry.target.dataset.animated = 'true';
    animateCounter(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(counter => {
  if (counter.dataset.suffix === undefined) {
    const label = counter.closest('.stat-item')?.querySelector('span')?.textContent || '';
    if (label.includes('Experience') || label.includes('Projects')) {
      counter.dataset.suffix = '+';
    }
  }
  counterObserver.observe(counter);
});

document.querySelectorAll('.skill-card, .project-card, .timeline-content, .contact-item').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

document.querySelectorAll('.chat-prompt').forEach((prompt, index) => {
  prompt.style.animationDelay = `${index * 0.4}s`;
});
