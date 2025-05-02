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
        swatch.parentElement.querySelector('.mw-text-secondary');
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

    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('open');
      navbar.classList.toggle('open');
    });
  }

  // ===== Progress Bars =====
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.mw-progress-fill');
    if (progressBars.length === 0) return;

    setTimeout(() => {
      progressBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
    }, 500);
  }

  // ===== Smooth Scrolling =====
  function initSmoothScrolling() {
    const menuBtn = document.querySelector('.mw-menu-btn');
    const nav = document.querySelector('.mw-nav');

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Skip empty anchors

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth',
          });

          // Close mobile menu if open
          if (menuBtn && nav) {
            menuBtn.classList.remove('open');
            nav.classList.remove('open');
          }

          // Update active link
          document.querySelectorAll('.mw-nav-link').forEach((link) => {
            link.classList.remove('active');
          });
          this.classList.add('active');
        }
      });
    });
  }

  // ===== Scroll Spy =====
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mw-nav-link');

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
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
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
})();
