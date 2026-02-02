// Main JavaScript Entry Point

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initProjectFilter();
  initScrollSpy();
  initRevealAnimations();
  initContactForm();
});

/* --- Theme Toggle --- */
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  // Function to set icons
  const updateIcons = (isLight) => {
    if (isLight) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline-block';
    } else {
      sunIcon.style.display = 'inline-block';
      moonIcon.style.display = 'none';
    }
  };

  // Check saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    updateIcons(true);
  } else {
    updateIcons(false);
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateIcons(isLight);

    // Simple icon rotation animation
    const activeIcon = isLight ? moonIcon : sunIcon;
    activeIcon.style.transform = 'rotate(360deg)';
    setTimeout(() => activeIcon.style.transform = 'none', 300);
  });
}

/* --- Project Filter --- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projects.forEach(project => {
        if (filter === 'all' || project.getAttribute('data-category') === filter) {
          project.style.display = 'flex';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          }, 50);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          setTimeout(() => project.style.display = 'none', 300);
        }
      });
    });
  });
}

/* --- Scroll Spy (Nav Highlighting) --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --- Reveal Animations --- */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.section-title, .domain-card, .project-card, .skill-category, .timeline-item, .learning-card, .contact-card, .contact-form-wrapper');

  // Add initial state class
  revealElements.forEach(el => el.classList.add('hidden-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible-reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Particle Background (Canvas) --- */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  // Configuration
  const particleCount = 60;
  const connectionDistance = 150;
  const speed = 0.5;

  function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-primary') || '#3b82f6';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Get current color from CSS variable for updating theme
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim();
    const particleColor = accentColor || '#3b82f6';

    ctx.fillStyle = particleColor;
    ctx.strokeStyle = particleColor;

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Connections
      for (let i = index + 1; i < particles.length; i++) {
        const p2 = particles[i];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.globalAlpha = 1 - distance / connectionDistance;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  init();
  animate();
}

/* --- Contact Form Handling --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate submission
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span> <i class="bx bx-loader-alt bx-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span> <i class="bx bx-check"></i>';
      btn.style.backgroundColor = '#10b981'; // Green
      btn.style.borderColor = '#10b981';

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
      }, 3000);
    }, 1500);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  // 1. Target all sections and cards for animation
  const revealElements = document.querySelectorAll('.section, .domain-card, .project-card, .learning-card, .timeline-item');

  // 2. Add the hidden class initially
  revealElements.forEach(el => el.classList.add('hidden-reveal'));

  // 3. Setup the Observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible-reveal');
        // Once shown, we stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Slight offset for better feel
  });

  // 4. Start observing
  revealElements.forEach(el => revealObserver.observe(el));
});
