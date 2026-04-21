
    document.addEventListener('DOMContentLoaded', () => {

      /* ── 1. Universal scroll-reveal observer ── */
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('show');
          revealObs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-scale, .reveal-right, .animate-on-scroll, .section-heading-line'
      ).forEach(el => revealObs.observe(el));

      /* ── 2. Divider line animation ── */
      const divObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('show');
          divObs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.divider-line').forEach(el => divObs.observe(el));

      /* ── 3. Stagger children observer ── */
      const staggerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('show');
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 80}ms`;
          });
          staggerObs.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.stagger-children').forEach(el => staggerObs.observe(el));

      /* ── 4. Animated counter for stat numbers ── */
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1200;
          const start = performance.now();
          const startVal = target > 100 ? target - 80 : 0;

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (target - startVal) * eased);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          counterObs.unobserve(el);
        });
      }, { threshold: 0.6 });
      document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

      /* ── 5. Skill tiles pop-in stagger ── */
      const bentoObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const tiles = entry.target.querySelectorAll('.skill-tile');
          tiles.forEach((tile, i) => {
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(20px) scale(0.97)';
            tile.style.transition = `opacity 0.5s ease ${i * 70}ms, transform 0.5s cubic-bezier(0.34,1.3,0.64,1) ${i * 70}ms`;
            requestAnimationFrame(() => {
              tile.style.opacity = '1';
              tile.style.transform = 'translateY(0) scale(1)';
            });
          });
          bentoObs.unobserve(entry.target);
        });
      }, { threshold: 0.1 });
      const skillsSection = document.querySelector('#skills .skills-bento');
      if (skillsSection) bentoObs.observe(skillsSection);

      /* ── 6. Section entrance — add reveal classes automatically ── */
      const sections = ['#about', '#academic', '#skills', '#domain', '#projects', '#experience', '#contact'];
      sections.forEach(sel => {
        const sec = document.querySelector(sel);
        if (sec && !sec.classList.contains('reveal') && !sec.classList.contains('animate-on-scroll')) {
          sec.classList.add('reveal');
          revealObs.observe(sec);
        }
      });

      /* ── 7. Contact Form logic (Google Sheets) ── */
      const contactForm = document.getElementById('contactForm');
      const formStatus = document.getElementById('formStatus');
      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

      // Placeholder for your API Key/URL
      // Replace with your Google Apps Script Web App URL
      const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 

      if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            alert('Please configure your SCRIPT_URL in js/main.js first.');
            return;
          }

          // Show loading state
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Sending...';
          formStatus.style.display = 'none';

          const formData = new FormData(contactForm);
          const data = Object.fromEntries(formData.entries());

          try {
            const response = await fetch(SCRIPT_URL, {
              method: 'POST',
              body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.result === 'success') {
              formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
              formStatus.style.background = 'rgba(16, 185, 129, 0.1)';
              formStatus.style.color = '#059669';
              contactForm.reset();
            } else {
              throw new Error(result.error || 'Unknown error');
            }
          } catch (error) {
            console.error('Submission error:', error);
            formStatus.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            formStatus.style.background = 'rgba(186, 26, 26, 0.1)';
            formStatus.style.color = '#ba1a1a';
          } finally {
            formStatus.style.display = 'block';
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Signal';
          }
        });
      }

    });
