(function () {
  'use strict';

  // State classes: `mw-active` is the documented spelling, plain `active` is
  // the one older markup uses. Both are styled, so turning a state *off* has
  // to clear both - otherwise a stale `active` from the HTML would keep a
  // second tab lit.
  function setActive(el, on) {
    if (!el) return;
    el.classList.toggle('mw-active', on);
    if (!on) el.classList.remove('active');
  }

  function isActive(el) {
    return (
      !!el &&
      (el.classList.contains('mw-active') || el.classList.contains('active'))
    );
  }

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
    initHeaderLoginButton();
    initImageSliders();
    initCheckboxLists();
    initKanbanBoards();
    initCalendars();
    initDropdowns();
  });

  // ===== Dropdowns =====
  //
  // The menu is a <details>, so opening, closing, the keyboard and the state a
  // screen reader reads out are all the browser's job already. Two things it
  // does not do, because no markup can express them: close when the click lands
  // somewhere else, and close on Escape.
  //
  // Delegated to the document rather than bound per dropdown, so a menu added
  // to the page later works without being initialised.
  function initDropdowns() {
    function closeAll(except) {
      document.querySelectorAll('.mw-dropdown[open]').forEach((dropdown) => {
        if (dropdown !== except) dropdown.removeAttribute('open');
      });
    }

    document.addEventListener('click', function (event) {
      const dropdown = event.target.closest('.mw-dropdown');

      // Only one menu open at a time - opening a second while the first is
      // still up reads as two menus fighting over the same click
      closeAll(dropdown);

      if (!dropdown) return;

      // A choice inside the menu closes it. Anything the item does itself -
      // navigating, submitting - still runs; this only takes the menu away.
      if (event.target.closest('.mw-dropdown-item')) {
        dropdown.removeAttribute('open');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;

      const open = document.querySelector('.mw-dropdown[open]');
      if (!open) return;

      open.removeAttribute('open');
      // Focus goes back to what opened it, or it is left on a menu that is no
      // longer there and the next Tab starts from the top of the page
      const trigger = open.querySelector('summary');
      if (trigger) trigger.focus();
    });
  }

  // ===== Checkbox Lists =====
  function initCheckboxLists() {
    const checkboxLists = document.querySelectorAll(
      '.mw-item-list-checkbox, .mw-item-list-checkbox-scroll'
    );

    checkboxLists.forEach((list) => {
      const listItems = list.querySelectorAll('li');

      listItems.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('.mw-checkbox');

        if (!checkbox || !label) return;

        // Set initial state based on checkbox checked property
        if (checkbox.checked) {
          item.classList.add('mw-selected');
        }

        // Add click handler to the entire list item
        item.addEventListener('click', function (e) {
          if (
            e.target === checkbox ||
            e.target.closest('.mw-checkbox') === label
          ) {
            return;
          }
          toggleCheckbox(this);
        });

        // Add change handler to the checkbox itself
        checkbox.addEventListener('change', function () {
          const listItem = this.closest('li');
          if (this.checked) {
            listItem.classList.add('mw-selected');
          } else {
            listItem.classList.remove('mw-selected');
          }

          // Dispatch custom event
          listItem.dispatchEvent(
            new CustomEvent('checkboxToggle', {
              detail: { checked: this.checked, item: listItem },
            })
          );
        });

        // Add label click handler
        label.addEventListener('click', function (e) {
          setTimeout(() => {
            const listItem = this.closest('li');
            const checkbox = this.querySelector('input[type="checkbox"]');

            if (checkbox.checked) {
              listItem.classList.add('mw-selected');
            } else {
              listItem.classList.remove('mw-selected');
            }
          }, 0);
        });
      });
    });

    // Listen for custom events (optional - for debugging or external handling)
    document.addEventListener('checkboxToggle', function (event) {
      console.log('Checkbox toggled:', event.detail.checked, event.detail.item);
    });
  }

  // Global function for manual checkbox toggling (for onclick attributes)
  window.toggleCheckbox = function (listItem) {
    const checkbox = listItem.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    const isChecked = checkbox.checked;

    // Toggle checkbox
    checkbox.checked = !isChecked;

    // Add/remove selected class for visual feedback
    if (checkbox.checked) {
      listItem.classList.add('mw-selected');
    } else {
      listItem.classList.remove('mw-selected');
    }

    // Dispatch custom event for external handling
    listItem.dispatchEvent(
      new CustomEvent('checkboxToggle', {
        detail: { checked: checkbox.checked, item: listItem },
      })
    );
  };

  // ===== Gallery Component =====
  function initGalleries() {
    document.querySelectorAll('.mw-gallery').forEach((gallery) => {
      // Dots and caption sit next to .mw-gallery, not inside it, so the
      // container is the scope - with the parent as a fallback, otherwise a
      // markup without the wrapper would silently stay dead
      const scope =
        gallery.closest('.mw-gallery-container') || gallery.parentElement;
      if (scope) initGallery(scope, gallery);
    });
  }

  function initGallery(container, gallery) {
    const track = gallery.querySelector('.mw-gallery-track');
    if (!track || !track.children.length) return;

    const slides = track.children;

    // Everything below the track is optional - a gallery may well ship
    // without arrows, dots or a caption, and a missing one must not throw
    const dotsBox = container.querySelector('.mw-gallery-dots');
    const descBox = container.querySelector('.mw-gallery-desc');
    const prevBtn = gallery.querySelector('.mw-gallery-navi-prev');
    const nextBtn = gallery.querySelector('.mw-gallery-navi-next');

    let current = 0;

    function goToSlide(index) {
      const total = slides.length;
      current = (index + total) % total;

      // Percentages refer to the track's own width, which is one slide -
      // so no measuring and nothing to recalculate on resize
      track.style.transform = `translateX(-${current * 100}%)`;

      if (dotsBox) {
        dotsBox.querySelectorAll('.mw-gallery-dot').forEach((dot, i) => {
          dot.classList.toggle('mw-active', i === current);
        });
      }

      if (descBox) {
        descBox.textContent = slides[current].dataset.desc || '';
      }
    }

    if (dotsBox) {
      for (let i = 0; i < slides.length; i++) {
        // A button, not a span: the dots are the only way to reach slide four
        // directly, and as a span nothing focuses them and no screen reader
        // says what they are.
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'mw-gallery-dot' + (i === 0 ? ' mw-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsBox.appendChild(dot);
      }
    }

    if (prevBtn)
      prevBtn.addEventListener('click', () => goToSlide(current - 1));
    if (nextBtn)
      nextBtn.addEventListener('click', () => goToSlide(current + 1));

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

    goToSlide(0);
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
      setActive(themeToggle, themeMode === 'light');

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
      setActive(themeToggle, lightMode);
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
    if (!rgb || rgb === 'transparent') return '#000000';

    const toHex = (v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, '0');

    const srgb = rgb.match(
      /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/
    );
    if (srgb) {
      const hex =
        '#' +
        toHex(srgb[1] * 255) +
        toHex(srgb[2] * 255) +
        toHex(srgb[3] * 255);
      const alpha = srgb[4] === undefined ? 1 : parseFloat(srgb[4]);
      return (alpha < 1 ? `${hex} / ${alpha}` : hex).toUpperCase();
    }

    const rgbArray = rgb.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (!rgbArray) return rgb;

    const hex =
      '#' + toHex(rgbArray[1]) + toHex(rgbArray[2]) + toHex(rgbArray[3]);
    const alpha = rgbArray[4] === undefined ? 1 : parseFloat(rgbArray[4]);
    return (alpha < 1 ? `${hex} / ${alpha}` : hex).toUpperCase();
  }

  // ===== Accordions =====
  function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.mw-accordion-header');
    accordionHeaders.forEach((header) => {
      // A header written as a <button> announces whether its panel is open.
      // Only when the markup says so - setting it on a <div> without a role
      // would claim a state for something that is not a control.
      const announces = header.tagName === 'BUTTON';
      if (announces) {
        header.setAttribute('aria-expanded', String(isActive(header)));
      }
      header.addEventListener('click', function () {
        const open = !isActive(this);
        setActive(this, open);
        setActive(this.nextElementSibling, open);
        if (announces) this.setAttribute('aria-expanded', String(open));
      });
    });
  }

  // ===== Mobile Navigation =====
  function initMobileNav() {
    const menuBtn = document.querySelector('.mw-menu-btn');
    const navbar = document.querySelector('.mw-navbar');

    if (!menuBtn || !navbar) return;

    function closeMenu() {
      menuBtn.classList.remove('open');
      navbar.classList.remove('open');
    }

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      menuBtn.classList.toggle('open');
      navbar.classList.toggle('open');
    }

    // Add multiple event listeners for better iOS compatibility
    menuBtn.addEventListener('click', toggleMenu);
    menuBtn.addEventListener('touchstart', toggleMenu, { passive: false });

    // The scrim is a body pseudo-element, so its taps land on the document
    document.addEventListener('click', function (e) {
      if (!navbar.classList.contains('open')) return;
      if (navbar.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
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
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const menuBtn = document.querySelector('.mw-menu-btn');
        const nav = document.querySelector('.mw-navbar');
        if (menuBtn && nav) {
          menuBtn.classList.remove('open');
          nav.classList.remove('open');
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

          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          setActive(link, false);

          const href = link.getAttribute('href');
          if (href) {
            const hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
              const linkTarget = href.substring(hashIndex + 1);
              if (linkTarget === current) {
                setActive(link, true);
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
            setActive(navItem, false);
          });

        setActive(this, true);

        const tabId = this.getAttribute('data-tab');
        if (!tabId) return;

        tabsContainer.querySelectorAll('.mw-tabs-panel').forEach((panel) => {
          setActive(panel, false);
        });

        setActive(document.getElementById(tabId), true);
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
          badge.setAttribute('data-value', val);
        } else {
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
  function initHeaderLoginButton() {
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

  // ===== Image Sliders =====
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
          setActive(img, parseInt(img.dataset.index) === current);
        });

        buttons.forEach((btn) => {
          setActive(btn, parseInt(btn.dataset.index) === current);
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

  // ===== Kanban Boards =====
  function initKanbanBoards() {
    document.querySelectorAll('.mw-kanban').forEach(initKanbanBoard);
  }

  function initKanbanBoard(board) {
    const columns = Array.from(board.querySelectorAll('.mw-kanban-column'));
    const composer = board.querySelector('.mw-kanban-composer');
    const template = board.querySelector('.mw-kanban-card-template');
    const ticketPrefix = board.dataset.kanbanPrefix || 'MW';
    const titleField = composer.querySelector('.mw-kanban-composer-title');
    const textField = composer.querySelector('.mw-kanban-composer-text');
    const priorityField = composer.querySelector(
      '.mw-kanban-composer-priority'
    );
    const assigneeField = composer.querySelector(
      '.mw-kanban-composer-assignee'
    );

    let editing = null;

    function refresh() {
      columns.forEach(function (column, index) {
        const cards = column.querySelectorAll('.mw-kanban-card');
        const counter = column.querySelector('.mw-kanban-count');
        if (counter) counter.textContent = cards.length;

        column
          .querySelectorAll('[data-kanban-move]')
          .forEach(function (button) {
            const target = index + parseInt(button.dataset.kanbanMove, 10);
            button.disabled = target < 0 || target >= columns.length;
          });
      });
    }

    function nextTicketId() {
      const numbers = Array.from(
        board.querySelectorAll('.mw-kanban-card-id')
      ).map(function (element) {
        return parseInt(element.textContent.split('-').pop(), 10) || 0;
      });

      return ticketPrefix + '-' + (Math.max(0, ...numbers) + 1);
    }

    function cardRibbonTone(card) {
      const ribbon = card.querySelector('.mw-card-ribbon');
      if (!ribbon) return '';

      const tone = Array.from(ribbon.classList).find(function (name) {
        return name.indexOf('mw-card-addon-') === 0;
      });

      return tone ? tone.replace('mw-card-addon-', '') : '';
    }

    function setPriority(card, option) {
      const current = card.querySelector('.mw-card-ribbon');
      if (current) current.remove();
      if (!option || !option.value) return;

      const ribbon = document.createElement('div');
      ribbon.className = 'mw-card-ribbon mw-card-addon-' + option.value;
      ribbon.textContent = option.textContent;
      card.prepend(ribbon);
    }

    function cardAssignee(card) {
      const avatar = card.querySelector('.mw-avatar-initials');
      return avatar ? avatar.textContent.trim() : '';
    }

    function cardText(card, selector) {
      const element = card.querySelector(selector);
      return element ? element.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    function setAssignee(card, initials) {
      const actions = card.querySelector('.mw-kanban-card-actions');
      const current = actions.querySelector('.mw-avatar');

      if (!initials) {
        if (current) current.remove();
        return;
      }

      const avatar = current || document.createElement('div');
      avatar.className = 'mw-avatar mw-avatar-xs mw-avatar-initials';
      avatar.textContent = initials;
      if (!current) actions.prepend(avatar);
    }

    function openComposer(column, card) {
      closeComposer();
      editing = card || null;

      titleField.value = card ? cardText(card, '.mw-kanban-card-title') : '';
      textField.value = card ? cardText(card, '.mw-kanban-card-text') : '';
      priorityField.value = card ? cardRibbonTone(card) : '';
      assigneeField.value = card ? cardAssignee(card) : '';

      if (card) {
        card.classList.add('mw-kanban-editing');
        card.before(composer);
      } else {
        column.querySelector('.mw-kanban-column-body').prepend(composer);
      }

      composer.classList.add('mw-active');
      titleField.focus();
    }

    function closeComposer() {
      composer.classList.remove('mw-active');
      if (editing) editing.classList.remove('mw-kanban-editing');
      editing = null;
    }

    function saveComposer() {
      const title = titleField.value.trim();
      if (!title) {
        titleField.focus();
        return;
      }

      const card =
        editing || template.content.firstElementChild.cloneNode(true);
      card.querySelector('.mw-kanban-card-title').textContent = title;
      card.querySelector('.mw-kanban-card-text').textContent =
        textField.value.trim();
      setPriority(card, priorityField.selectedOptions[0]);
      setAssignee(card, assigneeField.value);

      if (!editing) {
        const ticketId = nextTicketId();
        card.classList.add('mw-kanban-card-in');
        card.querySelector('.mw-kanban-card-id').textContent = ticketId;
        // The template labels carry a placeholder key - swap in the real one
        card.querySelectorAll('[aria-label]').forEach(function (button) {
          button.setAttribute(
            'aria-label',
            button.getAttribute('aria-label').replace(/[A-Z]+-\d+/, ticketId)
          );
        });
        composer.before(card);
      }

      closeComposer();
      refresh();
    }

    const MOVE_CLASSES = [
      'mw-kanban-card-moved-forward',
      'mw-kanban-card-moved-back',
    ];

    function moveCard(card, offset) {
      const current = card.closest('.mw-kanban-column');
      const target = columns[columns.indexOf(current) + offset];
      if (!target) return;

      target.querySelector('.mw-kanban-column-body').appendChild(card);

      // The card lands in a lane somewhere else on the board, so it says so on
      // arrival and comes in from the side it was pushed from. Re-parenting it
      // alone made it blink into the other column with no motion at all.
      //
      // Both classes come off first and the reflow is forced in between: an
      // element that already carries the class it is being given again keeps
      // the finished animation and plays nothing, so a second push in the same
      // direction would be the silent one.
      card.classList.remove.apply(card.classList, MOVE_CLASSES);
      void card.offsetWidth;
      card.classList.add(offset > 0 ? MOVE_CLASSES[0] : MOVE_CLASSES[1]);

      refresh();
    }

    board.addEventListener('click', function (event) {
      const moveButton = event.target.closest('[data-kanban-move]');
      if (moveButton) {
        moveCard(
          moveButton.closest('.mw-kanban-card'),
          parseInt(moveButton.dataset.kanbanMove, 10)
        );

        if (moveButton.disabled) {
          const sibling = moveButton.parentElement.querySelector(
            '[data-kanban-move]:not(:disabled)'
          );
          if (sibling) sibling.focus();
        }
        return;
      }

      const editButton = event.target.closest('.mw-kanban-edit');
      if (editButton) {
        const card = editButton.closest('.mw-kanban-card');
        openComposer(card.closest('.mw-kanban-column'), card);
        return;
      }

      const deleteButton = event.target.closest('.mw-kanban-delete');
      if (deleteButton) {
        const card = deleteButton.closest('.mw-kanban-card');
        if (card === editing) closeComposer();
        card.remove();
        refresh();
        return;
      }

      const addButton = event.target.closest('.mw-kanban-add');
      if (addButton) {
        openComposer(addButton.closest('.mw-kanban-column'), null);
        return;
      }

      if (event.target.closest('.mw-kanban-composer-cancel')) closeComposer();
    });

    composer.addEventListener('submit', function (event) {
      event.preventDefault();
      saveComposer();
    });

    composer.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeComposer();
    });

    refresh();
  }
  // ===== Calendars =====
  function initCalendars() {
    document.querySelectorAll('[data-calendar]').forEach(initCalendar);
  }

  // Status dots come in as {"2026-08-19": ["success", "warning"]}
  function parseCalendarMarkers(raw) {
    if (!raw) return {};

    try {
      return JSON.parse(raw);
    } catch (error) {
      return {};
    }
  }

  function initCalendar(calendar) {
    const grid = calendar.querySelector('.mw-calendar-grid');
    const title = calendar.querySelector('.mw-calendar-title');
    if (!grid) return;

    const weekMode = calendar.dataset.calendar === 'week';
    const markers = parseCalendarMarkers(calendar.dataset.calendarMarkers);
    // Falls back to the document language, so a German page gets German day
    // names without configuring anything
    const locale =
      calendar.dataset.calendarLocale ||
      document.documentElement.lang ||
      undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let cursor = calendar.dataset.calendarDate
      ? new Date(calendar.dataset.calendarDate + 'T00:00:00')
      : new Date(today);
    let selected = calendar.dataset.calendarSelected || '';

    // Monday first: that is what ISO weeks use, and it keeps the weekend
    // together as one block on the right
    function startOfWeek(date) {
      const result = new Date(date);
      result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
      return result;
    }

    // Local date key - toISOString() would shift the day across a timezone
    function dateKey(date) {
      return (
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
      );
    }

    // ISO 8601: the week owning the Thursday owns the number
    function weekNumber(date) {
      const thursday = startOfWeek(date);
      thursday.setDate(thursday.getDate() + 3);

      const firstThursday = startOfWeek(new Date(thursday.getFullYear(), 0, 4));
      firstThursday.setDate(firstThursday.getDate() + 3);

      return 1 + Math.round((thursday - firstThursday) / 604800000);
    }

    function headline() {
      if (!weekMode) {
        return cursor.toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric',
        });
      }

      const from = startOfWeek(cursor);
      const to = new Date(from);
      to.setDate(to.getDate() + 6);

      // The month is only spelled out twice when the week straddles two of them
      const fromLabel = from.toLocaleDateString(locale, {
        day: 'numeric',
        month: from.getMonth() === to.getMonth() ? undefined : 'short',
      });
      const toLabel = to.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return 'Week ' + weekNumber(from) + ' · ' + fromLabel + ' - ' + toLabel;
    }

    function isWeekend(date) {
      const weekday = date.getDay();
      return weekday === 0 || weekday === 6;
    }

    function renderWeekdays() {
      const day = startOfWeek(new Date());

      for (let index = 0; index < 7; index++) {
        const cell = document.createElement('div');
        cell.className = 'mw-calendar-weekday';
        if (isWeekend(day)) cell.classList.add('mw-calendar-weekend');
        // Decorative: every day button already carries its weekday in the label
        cell.setAttribute('aria-hidden', 'true');
        cell.textContent = day.toLocaleDateString(locale, { weekday: 'short' });
        grid.appendChild(cell);
        day.setDate(day.getDate() + 1);
      }
    }

    function renderDay(date, month) {
      const key = dateKey(date);
      const cell = document.createElement('button');

      cell.type = 'button';
      cell.className = 'mw-calendar-day';
      cell.tabIndex = -1;
      cell.dataset.calendarDay = key;
      cell.setAttribute('aria-pressed', key === selected ? 'true' : 'false');
      // The bare number is not an accessible name - the arrows only announce
      // where you are going, not where you landed
      cell.setAttribute(
        'aria-label',
        date.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );

      if (isWeekend(date)) cell.classList.add('mw-calendar-weekend');
      if (!weekMode && date.getMonth() !== month) {
        cell.classList.add('mw-calendar-adjacent');
      }
      if (key === dateKey(today)) {
        cell.classList.add('mw-calendar-today');
        cell.setAttribute('aria-current', 'date');
      }
      if (key === selected) cell.classList.add('mw-selected');

      const number = document.createElement('span');
      number.className = 'mw-calendar-date';
      number.textContent = date.getDate();
      cell.appendChild(number);

      const tones = [].concat(markers[key] || []);
      if (tones.length) {
        const dots = document.createElement('span');
        dots.className = 'mw-calendar-dots';

        tones.forEach(function (tone) {
          const dot = document.createElement('span');
          dot.className = tone
            ? 'mw-calendar-dot mw-calendar-dot-' + tone
            : 'mw-calendar-dot';
          dots.appendChild(dot);
        });

        cell.appendChild(dots);
      }

      return cell;
    }

    // A month always gets six rows. Rendering only the rows it needs would make
    // the calendar - and everything below it - jump on every month change.
    function render() {
      const month = cursor.getMonth();
      const cells = weekMode ? 7 : 42;
      const date = weekMode
        ? startOfWeek(cursor)
        : startOfWeek(new Date(cursor.getFullYear(), month, 1));

      grid.innerHTML = '';
      renderWeekdays();

      for (let index = 0; index < cells; index++) {
        grid.appendChild(renderDay(date, month));
        date.setDate(date.getDate() + 1);
      }

      if (title) title.textContent = headline();
      setTabStop();
    }

    // One tab stop for the whole grid; the arrow keys move inside it
    function setTabStop() {
      const cell =
        grid.querySelector('.mw-selected') ||
        grid.querySelector('.mw-calendar-today') ||
        grid.querySelector('.mw-calendar-day:not(.mw-calendar-adjacent)') ||
        grid.querySelector('.mw-calendar-day');

      if (cell) cell.tabIndex = 0;
    }

    function select(key) {
      selected = key === selected ? '' : key;

      grid.querySelectorAll('.mw-calendar-day').forEach(function (cell) {
        const active = cell.dataset.calendarDay === selected;
        cell.classList.toggle('mw-selected', active);
        cell.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      calendar.dispatchEvent(
        new CustomEvent('mw-calendar-select', {
          bubbles: true,
          detail: { date: selected },
        })
      );
    }

    function step(offset) {
      if (weekMode) {
        cursor.setDate(cursor.getDate() + offset * 7);
      } else {
        // Snap to the first - stepping on from the 31st would skip February
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1);
      }

      render();
    }

    function focusDate(date) {
      const key = dateKey(date);
      let cell = grid.querySelector('[data-calendar-day="' + key + '"]');

      // Walked off the rendered range - turn the page and look again
      if (!cell) {
        cursor = new Date(date);
        render();
        cell = grid.querySelector('[data-calendar-day="' + key + '"]');
      }

      if (!cell) return;

      grid.querySelectorAll('.mw-calendar-day').forEach(function (other) {
        other.tabIndex = -1;
      });
      cell.tabIndex = 0;
      cell.focus();
    }

    calendar.addEventListener('click', function (event) {
      const navButton = event.target.closest('[data-calendar-nav]');
      if (navButton) {
        step(parseInt(navButton.dataset.calendarNav, 10));
        return;
      }

      const dayButton = event.target.closest('.mw-calendar-day');
      if (dayButton && !dayButton.disabled) {
        select(dayButton.dataset.calendarDay);
      }
    });

    grid.addEventListener('keydown', function (event) {
      const offsets = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
      };
      const offset = offsets[event.key];
      if (!offset) return;

      const current = event.target.closest('.mw-calendar-day');
      if (!current) return;

      event.preventDefault();
      const target = new Date(current.dataset.calendarDay + 'T00:00:00');
      target.setDate(target.getDate() + offset);
      focusDate(target);
    });

    render();
  }
})();
