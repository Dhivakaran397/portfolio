document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const loader = document.getElementById('pageLoader');
  const typingText = document.getElementById('typingText');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const emailjsHintBtn = document.getElementById('emailjsHintBtn');
  const skillItems = document.querySelectorAll('.skill-item');
  const fields = document.querySelectorAll('.floating-field input, .floating-field textarea');
  const imageFallbackMap = createFallbackMap();

  if (window.AOS) {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
      offset: 80,
    });
  }

  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 450);
    activateSkillBars();
  });

  const typingWords = ['Full Stack Developer', 'MERN Stack Developer', 'Web Developer', 'Problem Solver'];
  startTypingEffect(typingText, typingWords);
  setupNavToggle();
  setupNavLinks();
  setupActiveSectionObserver();
  setupScrollTop();
  setupFormValidation();
  setupFieldStates();
  setupImageFallbacks();
  setupParticles();
  setupEmailjsHint();

  function setupNavToggle() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupNavLinks() {
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setupActiveSectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
        });
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0.2,
    });

    sections.forEach((section) => observer.observe(section));
  }

  function setupScrollTop() {
    const toggleVisibility = () => {
      scrollTopBtn?.classList.toggle('show', window.scrollY > 560);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    scrollTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function activateSkillBars() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const bars = entry.target.querySelectorAll('.skill-item');
        bars.forEach((item) => {
          const level = item.dataset.level || '0';
          const bar = item.querySelector('.skill-bar i');
          if (bar) {
            requestAnimationFrame(() => {
              bar.style.width = `${level}%`;
            });
          }
        });

        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    skillItems.forEach((item) => observer.observe(item.closest('.skill-card')));
  }

  function startTypingEffect(target, words) {
    if (!target || !words.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const currentWord = words[wordIndex];
      const displayed = currentWord.slice(0, charIndex);
      target.textContent = displayed;

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      charIndex += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 55 : 95);
    };

    tick();
  }

  function setupFormValidation() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearStatus();

      const data = Object.fromEntries(new FormData(contactForm).entries());
      const errors = validateContactForm(data);

      if (errors.length) {
        showStatus(errors[0], 'error');
        return;
      }

      showStatus('Message validated. Connect EmailJS or your backend endpoint to send it.', 'success');
      contactForm.reset();
      fields.forEach((field) => field.classList.remove('has-value'));
    });
  }

  function validateContactForm(data) {
    const issues = [];
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const subject = String(data.subject || '').trim();
    const message = String(data.message || '').trim();

    if (name.length < 2) issues.push('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(email)) issues.push('Please enter a valid email address.');
    if (subject.length < 3) issues.push('Please add a subject.');
    if (message.length < 10) issues.push('Please write a longer message.');

    return issues;
  }

  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('success', 'error');
    formStatus.classList.add(type);
  }

  function clearStatus() {
    if (!formStatus) return;
    formStatus.textContent = '';
    formStatus.classList.remove('success', 'error');
  }

  function setupFieldStates() {
    fields.forEach((field) => {
      const syncState = () => {
        field.classList.toggle('has-value', field.value.trim().length > 0);
      };

      field.addEventListener('input', syncState);
      field.addEventListener('blur', syncState);
      syncState();
    });
  }

  function setupEmailjsHint() {
    emailjsHintBtn?.addEventListener('click', () => {
      showStatus('EmailJS integration placeholder: add your public key, service ID, and template ID in script.js or connect a backend submit handler.', 'success');
    });
  }

  function setupImageFallbacks() {
    const fallbackTargets = document.querySelectorAll('[data-fallback]');
    fallbackTargets.forEach((image) => {
      const key = image.dataset.fallback;
      const fallback = imageFallbackMap[key];
      if (!fallback) return;

      image.addEventListener('error', () => {
        if (image.dataset.fallbackApplied === 'true') return;
        image.dataset.fallbackApplied = 'true';
        image.src = fallback;
      });
    });
  }

  function createFallbackMap() {
    const svg = (markup) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;

    return {
      hero: svg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
          <defs>
            <radialGradient id="g1" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stop-color="#24f6ff" stop-opacity="0.26"/>
              <stop offset="100%" stop-color="#08111e"/>
            </radialGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stop-color="#6c5cff"/>
              <stop offset="100%" stop-color="#00e5ff"/>
            </linearGradient>
          </defs>
          <rect width="900" height="900" fill="url(#g1)"/>
          <circle cx="450" cy="430" r="220" fill="#162338" stroke="rgba(255,255,255,0.12)" stroke-width="10"/>
          <circle cx="450" cy="340" r="96" fill="#d6e5ff"/>
          <path d="M270 700c28-112 110-168 180-168s152 56 180 168" fill="#d6e5ff"/>
          <path d="M350 328c12 26 34 40 52 40s40-14 52-40" fill="none" stroke="#0d1628" stroke-width="18" stroke-linecap="round"/>
          <path d="M446 552l-54 36 58 56 56-56z" fill="url(#g2)"/>
          <rect x="162" y="166" width="188" height="34" rx="17" fill="rgba(255,255,255,0.08)"/>
          <rect x="580" y="182" width="152" height="34" rx="17" fill="rgba(255,255,255,0.08)"/>
          <rect x="206" y="698" width="480" height="22" rx="11" fill="rgba(255,255,255,0.08)"/>
        </svg>
      `),
      about: svg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
          <defs>
            <linearGradient id="ag1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f1c33"/>
              <stop offset="100%" stop-color="#07111f"/>
            </linearGradient>
            <radialGradient id="ag2" cx="25%" cy="25%" r="60%">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.38"/>
              <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1200" height="1200" fill="url(#ag1)"/>
          <circle cx="320" cy="300" r="260" fill="url(#ag2)"/>
          <rect x="150" y="650" width="900" height="210" rx="34" fill="#0e1a2e" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
          <rect x="220" y="520" width="380" height="170" rx="28" fill="#121f36" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
          <rect x="660" y="470" width="360" height="250" rx="30" fill="#121f36" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
          <rect x="260" y="570" width="300" height="18" rx="9" fill="#24f6ff" opacity="0.7"/>
          <rect x="260" y="605" width="220" height="18" rx="9" fill="#6c5cff" opacity="0.78"/>
          <rect x="705" y="520" width="220" height="16" rx="8" fill="#24f6ff" opacity="0.65"/>
          <rect x="705" y="555" width="180" height="16" rx="8" fill="#6c5cff" opacity="0.65"/>
          <circle cx="875" cy="310" r="122" fill="#16263f" stroke="#24f6ff" stroke-width="8"/>
          <rect x="803" y="285" width="144" height="18" rx="9" fill="#e6f1ff" opacity="0.85"/>
          <rect x="790" y="325" width="170" height="18" rx="9" fill="#e6f1ff" opacity="0.55"/>
          <rect x="812" y="370" width="126" height="18" rx="9" fill="#e6f1ff" opacity="0.55"/>
          <path d="M170 875h860" stroke="rgba(255,255,255,0.12)" stroke-width="10" stroke-linecap="round"/>
        </svg>
      `),
      projectOne: svg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">
          <defs>
            <linearGradient id="p1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#10304a"/>
              <stop offset="100%" stop-color="#06111d"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="750" fill="url(#p1)"/>
          <rect x="90" y="88" width="1020" height="574" rx="32" fill="#0e1a2e" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
          <rect x="150" y="150" width="330" height="54" rx="20" fill="#24f6ff" opacity="0.82"/>
          <rect x="150" y="232" width="710" height="20" rx="10" fill="#dce9ff" opacity="0.56"/>
          <rect x="150" y="274" width="660" height="20" rx="10" fill="#dce9ff" opacity="0.33"/>
          <rect x="150" y="352" width="260" height="214" rx="22" fill="#16263f"/>
          <rect x="440" y="352" width="330" height="214" rx="22" fill="#1a2944"/>
          <rect x="800" y="352" width="170" height="214" rx="22" fill="#192743"/>
          <circle cx="258" cy="440" r="54" fill="#6c5cff"/>
          <circle cx="595" cy="440" r="54" fill="#24f6ff"/>
          <rect x="800" y="386" width="130" height="18" rx="9" fill="#dce9ff" opacity="0.8"/>
          <rect x="800" y="424" width="110" height="18" rx="9" fill="#dce9ff" opacity="0.55"/>
        </svg>
      `),
      projectTwo: svg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">
          <defs>
            <linearGradient id="p2" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#17102f"/>
              <stop offset="100%" stop-color="#06111d"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="750" fill="url(#p2)"/>
          <rect x="86" y="86" width="1028" height="578" rx="36" fill="#0f1a2e" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
          <rect x="136" y="146" width="260" height="62" rx="20" fill="#6c5cff" opacity="0.88"/>
          <rect x="418" y="146" width="220" height="62" rx="20" fill="#24f6ff" opacity="0.85"/>
          <rect x="660" y="146" width="220" height="62" rx="20" fill="#18ffa8" opacity="0.76"/>
          <rect x="136" y="248" width="410" height="316" rx="26" fill="#16263f"/>
          <rect x="582" y="248" width="452" height="316" rx="26" fill="#192743"/>
          <rect x="182" y="292" width="138" height="138" rx="24" fill="#24f6ff" opacity="0.8"/>
          <rect x="352" y="292" width="138" height="138" rx="24" fill="#6c5cff" opacity="0.76"/>
          <rect x="626" y="296" width="346" height="22" rx="11" fill="#dce9ff" opacity="0.64"/>
          <rect x="626" y="338" width="290" height="22" rx="11" fill="#dce9ff" opacity="0.36"/>
          <rect x="626" y="394" width="248" height="22" rx="11" fill="#dce9ff" opacity="0.36"/>
          <rect x="626" y="452" width="180" height="48" rx="18" fill="#18ffa8" opacity="0.8"/>
        </svg>
      `),
      resume: svg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
          <defs>
            <linearGradient id="r1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#0f1b30"/>
              <stop offset="100%" stop-color="#070e18"/>
            </linearGradient>
          </defs>
          <rect width="900" height="1200" fill="url(#r1)"/>
          <rect x="110" y="90" width="680" height="1020" rx="32" fill="#f4f8ff"/>
          <rect x="110" y="90" width="680" height="150" rx="32" fill="#0f1b30"/>
          <circle cx="220" cy="165" r="52" fill="#24f6ff"/>
          <rect x="302" y="128" width="240" height="22" rx="11" fill="#dce9ff" opacity="0.95"/>
          <rect x="302" y="166" width="180" height="16" rx="8" fill="#dce9ff" opacity="0.7"/>
          <rect x="170" y="302" width="560" height="22" rx="11" fill="#0f1b30" opacity="0.88"/>
          <rect x="170" y="354" width="500" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="392" width="470" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="470" width="560" height="18" rx="9" fill="#0f1b30" opacity="0.88"/>
          <rect x="170" y="510" width="520" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="550" width="420" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="660" width="560" height="18" rx="9" fill="#6c5cff" opacity="0.76"/>
          <rect x="170" y="704" width="460" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="746" width="500" height="18" rx="9" fill="#0f1b30" opacity="0.36"/>
          <rect x="170" y="840" width="230" height="48" rx="18" fill="#24f6ff" opacity="0.78"/>
        </svg>
      `),
    };
  }

  function setupParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const particles = [];
    const particleCount = Math.min(72, Math.floor(window.innerWidth / 18));
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resize();

    for (let index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }

    window.addEventListener('resize', resize);

    const animate = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;

        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = particle.alpha;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    function createParticle() {
      const palette = ['rgba(0,229,255,0.9)', 'rgba(124,92,255,0.85)', 'rgba(24,255,168,0.75)'];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 1.2 + Math.random() * 2.8,
        alpha: 0.2 + Math.random() * 0.55,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    }
  }
});
