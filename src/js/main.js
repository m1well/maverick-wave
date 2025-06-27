(function () {
  'use strict';

  // Initialize all components when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initGalleries();
    initThemeToggle();
    initColorSwatches();
    initAccordions();
    initMobileNav();
    initProgressBars();
    initSmoothScrolling();
    initScrollSpy();
    initTabs();
    initAlerts();
    initLocalhostIndicator();
    initFormSliders();
    initModals();
    initLoginButton();
    initImageSliders();
  });

  // ===== Gallery Component =====
  function initGalleries() {
    const track = document.querySelector('.mw-gallery-track');

    if (track) {
      const dots = document.querySelector('.mw-gallery-dots');
      const slides = track.children;
      const descBox = document.querySelector('.mw-gallery-desc');
      const prevBtn = document.querySelector('.mw-gallery-navi-prev');
      const nextBtn = document.querySelector('.mw-gallery-navi-next');
      const sliderContainer = document.querySelector('.mw-gallery');

      let current = 0;

      function updateSliderPosition() {
        const slideWidth = sliderContainer.offsetWidth;
        track.style.transform = `translateX(-${current * slideWidth}px)`;
      }

      function goToSlide(index) {
        const total = slides.length;
        current = (index + total) % total;
        updateSliderPosition();

        document.querySelectorAll('.mw-gallery-dot').forEach((dot, i) => {
          dot.classList.toggle('mw-active', i === current);
        });

        descBox.textContent = slides[current].dataset.desc;
      }

      function initDots() {
        for (let i = 0; i < slides.length; i++) {
          const dot = document.createElement('span');
          dot.className = 'mw-gallery-dot' + (i === 0 ? ' mw-active' : '');
          dot.addEventListener('click', () => goToSlide(i));
          dots.appendChild(dot);
        }
      }

      prevBtn.addEventListener('click', () => goToSlide(current - 1));
      nextBtn.addEventListener('click', () => goToSlide(current + 1));

      window.addEventListener('resize', updateSliderPosition);

      // Optional: Swipe support
      let startX = 0;
      track.addEventListener(
        'touchstart',
        (e) => (startX = e.touches[0].clientX)
      );
      track.addEventListener('touchend', (e) => {
        const delta = e.changedTouches[0].clientX - startX;
        if (delta > 50) goToSlide(current - 1);
        if (delta < -50) goToSlide(current + 1);
      });

      initDots();
      updateSliderPosition(); // Initial layout
    }
  }

  // ===== Theme Toggle =====
  function initThemeToggle() {
    const themeToggle = document.querySelector('.mw-theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    const icon = themeToggle.querySelector('.mw-theme-toggle-slider i');

    const computedStyle = getComputedStyle(document.documentElement);
    const themeMode =
      computedStyle.getPropertyValue('--mw-internal-theme-mode').trim() ||
      'switchable';

    // mode dark or light
    if (themeMode !== 'switchable') {
      console.log(`Theme mode fixed to: ${themeMode}. Disabling toggle.`);
      if (icon) {
        icon.className = themeMode === 'light' ? 'fas fa-sun' : 'fas fa-moon';
      }
      // Adjust toggle 'active' state if needed (assuming 'active' shows sun)
      if (themeMode === 'light') {
        themeToggle.classList.add('active');
      } else {
        themeToggle.classList.remove('active');
      }

      // Disable existing toggle visually and functionally
      themeToggle.style.opacity = '0.4';
      themeToggle.style.pointerEvents = 'none';
      themeToggle.style.cursor = 'default';
      themeToggle.setAttribute('aria-disabled', 'true');

      // Clean up potentially conflicting localStorage
      localStorage.removeItem('mw-theme');

      // Ensure body class is correct for fixed mode (remove light if fixed dark)
      if (themeMode === 'dark') {
        body.classList.remove('mw-theme-light');
      }

      return;
    }

    // mode switchable - only runs if themeMode === 'switchable'
    let isLight = localStorage.getItem('mw-theme') === 'light';

    // Function to apply theme styles and icon
    const applyTheme = (lightMode) => {
      // Use toggle's second argument for cleaner class switching
      body.classList.toggle('mw-theme-light', lightMode);
      themeToggle.classList.toggle('active', lightMode);
      if (icon) {
        icon.className = lightMode ? 'fas fa-sun' : 'fas fa-moon';
      }
    };

    // Set initial theme based on isLight
    applyTheme(isLight);

    // Add click listener for switching
    themeToggle.addEventListener('click', () => {
      isLight = !isLight;
      applyTheme(isLight);
      localStorage.setItem('mw-theme', isLight ? 'light' : 'dark'); // Save

      // update color swatches
      setTimeout(updateColorSwatchHexValues, 400);
    });
  }

  // ===== Color Swatches =====
  function initColorSwatches() {
    updateColorSwatchHexValues();
  }

  function updateColorSwatchHexValues() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach((swatch) => {
      const bgColor = window.getComputedStyle(swatch).backgroundColor;
      const hex = rgbToHex(bgColor);
      const hexTextElement =
        swatch.parentElement.querySelector('.mw-text-muted');
      if (hexTextElement) {
        hexTextElement.textContent = hex;
      }
    });
  }

  function rgbToHex(rgb) {
    // Check if the color is in RGB/RGBA format
    if (!rgb || rgb === 'transparent') return '#000000';

    let rgbArray;
    if (rgb.startsWith('rgba')) {
      rgbArray = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    } else {
      rgbArray = rgb.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
    }

    if (!rgbArray) return rgb; // Return original if not RGB format

    const r = parseInt(rgbArray[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbArray[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbArray[3], 10).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toUpperCase();
  }

  // ===== Accordions =====
  function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.mw-accordion-header');
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content) content.classList.toggle('active');
      });
    });
  }

  // ===== Mobile Navigation =====
  function initMobileNav() {
    const menuBtn = document.querySelector('.mw-menu-btn');
    const navbar = document.querySelector('.mw-navbar');

    if (!menuBtn || !navbar) return;

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      menuBtn.classList.toggle('open');
      navbar.classList.toggle('open');
    }

    // Add multiple event listeners for better iOS compatibility
    menuBtn.addEventListener('click', toggleMenu);
    menuBtn.addEventListener('touchstart', toggleMenu, { passive: false });
  }

  // ===== Progress Bars =====
  function initProgressBars() {
    const fills = document.querySelectorAll('.mw-progress-fill');
    if (!fills.length) return;

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          const pct = bar.dataset.value || 0;
          // trigger the CSS transition
          bar.style.width = pct + '%';
          // stop observing this one
          observer.unobserve(bar);
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    fills.forEach((bar) => obs.observe(bar));
  }

  // ===== Smooth Scrolling =====
  function initSmoothScrolling() {
    const menuBtn = document.querySelector('.mw-menu-btn');
    const nav = document.querySelector('.mw-navbar');

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Calculate dynamic header height
          const header = document.querySelector('.mw-header');

          const headerHeight = header ? header.offsetHeight : 0;
          const additionalOffset = 5;

          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          if (menuBtn && nav) {
            menuBtn.classList.remove('open');
            nav.classList.remove('open');
          }

          document.querySelectorAll('.mw-navbar-link').forEach((link) => {
            link.classList.remove('active');
          });

          if (this.classList.contains('mw-navbar-link')) {
            this.classList.add('active');
          }
        } else {
          console.warn(`Target element ${targetId} not found`);
        }
      });
    });
  }

  // ===== Scroll Spy =====
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mw-navbar-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener(
      'scroll',
      debounce(function () {
        let current = '';

        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.clientHeight;

          if (
            pageYOffset >= sectionTop &&
            pageYOffset < sectionTop + sectionHeight
          ) {
            // Section ID is just the plain ID, no # or /
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');

          const href = link.getAttribute('href');
          if (href) {
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
              const linkTarget = href.substring(hashIndex + 1);
              if (linkTarget === current) {
                link.classList.add('active');
              }
            }
          }
        });
      }, 100)
    );
  }

  // ===== Tabs =====
  function initTabs() {
    const tabNavItems = document.querySelectorAll('.mw-tabs-nav-item');

    tabNavItems.forEach((item) => {
      item.addEventListener('click', function () {
        const tabsContainer = this.closest('.mw-tabs');
        if (!tabsContainer) return;

        tabsContainer
          .querySelectorAll('.mw-tabs-nav-item')
          .forEach((navItem) => {
            navItem.classList.remove('active');
          });

        this.classList.add('active');

        const tabId = this.getAttribute('data-tab');
        if (!tabId) return;

        tabsContainer.querySelectorAll('.mw-tabs-panel').forEach((panel) => {
          panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(tabId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // ===== Alerts =====
  function initAlerts() {
    const alertCloseButtons = document.querySelectorAll('.mw-alert-close');

    alertCloseButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const alert = this.closest('.mw-alert');
        if (!alert) return;

        alert.classList.add('mw-alert-closing');
        setTimeout(() => {
          alert.classList.add('mw-alert-closed');
        }, 300);
      });
    });
  }

  // ===== Utility Functions =====
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // ===== Utility Functions =====
  function initLocalhostIndicator() {
    // add these class somewhere (best at the header) to activate
    const activated = document.querySelector(
      '.mw-localhost-indicator-activated'
    );
    const header = document.querySelector('.mw-header');

    if (activated) {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.');

      if (isLocalhost) {
        const indicator = document.createElement('div');
        indicator.className = 'mw-localhost-indicator-pulse';

        // Add the indicator as the first child of the header
        header.prepend(indicator);
      }
    }
  }

  // ===== Form Sliders =====
  function initFormSliders() {
    document.querySelectorAll('.mw-slider-container').forEach((wrapper) => {
      const slider = wrapper.querySelector('.mw-slider');
      const badge = wrapper.querySelector('.mw-slider-value');
      if (!slider || !badge) return;

      const update = () => {
        const val = Number(slider.value);
        const max = Number(slider.max) || 100;
        const pct = Math.round((val / max) * 100);

        // update track‐fill
        slider.style.setProperty('--value', pct + '%');

        // decide what to show in the badge
        if (badge.classList.contains('mw-slider-numeric')) {
          // raw number
          badge.setAttribute('data-value', val);
        } else {
          // percentage
          badge.setAttribute('data-value', pct);
        }
      };

      slider.addEventListener('input', update);

      update();
    });
  }

  // ===== Modals =====
  function initModals() {
    document.querySelectorAll('.mw-modal-close').forEach((button) => {
      button.addEventListener('click', function () {
        const modal = this.closest('.mw-modal-overlay');
        if (modal) {
          modal.classList.remove('mw-modal-open');
        }
      });
    });
  }

  // ===== Login Button =====
  function initLoginButton() {
    const loginButton = document.getElementById('login-button');

    if (loginButton) {
      loginButton.addEventListener('click', function () {
        const icon = this.querySelector('i');

        // Toggle between fa-user-lock and fa-user-tag
        if (icon.classList.contains('fa-lock')) {
          icon.classList.remove('fa-lock');
          icon.classList.add('fa-lock-open');
        } else {
          icon.classList.remove('fa-lock-open');
          icon.classList.add('fa-lock');
        }
      });
    }
  }

  // ===== Login Button =====
  function initImageSliders() {
    const sliders = document.querySelectorAll('.mw-image-slider');

    sliders.forEach((slider) => {
      const overlayImages = slider.querySelectorAll(
        '.mw-image-slider-overlay-image'
      );
      const buttons = slider.querySelectorAll('button[data-index]');

      if (!overlayImages.length || !buttons.length) return;

      let current = 0;

      function updateSliderView() {
        overlayImages.forEach((img) => {
          const imgIndex = parseInt(img.dataset.index);
          img.classList.toggle('active', imgIndex === current);
        });

        buttons.forEach((btn) => {
          const btnIndex = parseInt(btn.dataset.index);
          btn.classList.toggle('active', btnIndex === current);
        });
      }

      function goToSlide(index) {
        current = index;
        updateSliderView();
      }

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.dataset.index);
          goToSlide(index);
        });
      });

      updateSliderView();
    });
  }
})();
