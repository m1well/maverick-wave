(function () {
  'use strict';

  // Both spellings are styled, so turning a state off has to clear both or a
  // stale `active` in the HTML keeps a second tab lit
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

  // Every element that gets listeners of its own is remembered here, so running
  // init() again over markup that is already wired does nothing to it. A
  // WeakSet and not an attribute: nothing to clean up, nothing in the DOM, and
  // an element that is removed takes its entry with it.
  const wired = new WeakSet();

  function fresh(el) {
    if (!el || wired.has(el)) return false;
    wired.add(el);
    return true;
  }

  // Bound to the document, the window, or the one element of its kind a page
  // has. Running any of this twice would double the listeners, so it happens
  // once and is not part of init().
  let pageWired = false;

  function initPage() {
    if (pageWired) return;
    pageWired = true;

    initThemeToggle();
    initColorSwatches();
    initMobileNav();
    initHeaderReveal();
    initParallax();
    initSmoothScrolling();
    initScrollSpy();
    initModals();
    initLightbox();
    initDropdowns();
    initTagRemovals();
    initCopyButtons();
    initLocalhostIndicator();
    warnMissingViewportFit();
  }

  // Everything that binds per element - and therefore can meet markup that
  // arrived after the page did.
  function initComponents(root) {
    const scope = root || document;

    initGalleries(scope);
    initPortraitGalleries(scope);
    initMosaics(scope);
    initStoryReels(scope);
    initAccordions(scope);
    initProgressBars(scope);
    initReveals(scope);
    initTabs(scope);
    initAlerts(scope);
    initFormSliders(scope);
    initImageSliders(scope);
    initCheckboxLists(scope);
    initKanbanBoards(scope);
    initCalendars(scope);
    initLangSwitches(scope);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPage();
    initComponents(document);
  });

  // The way back in for anything that renders after DOMContentLoaded: an htmx
  // swap, a modal filled from a fetch, a view transition that replaces the
  // page body. Call it with the subtree that changed, or with nothing for the
  // whole document - elements already wired are skipped either way.
  window.MaverickWave = {
    init: function (root) {
      initPage();
      initComponents(root);
    },
  };

  // The menu is a <details>, so only two things are left: close on an outside
  // click and close on Escape. Delegated, so a menu added later works too.
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

  // Keeps the trigger in step with the choice and announces it - which language
  // actually loads is the application's business, usually the URL or the server:
  //   document.addEventListener('mw-language-change', (e) => e.detail.lang)
  function initLangSwitches(root) {
    root.querySelectorAll('.mw-lang-switch').forEach((languageSwitch) => {
      if (!fresh(languageSwitch)) return;
      const items = languageSwitch.querySelectorAll('[data-mw-lang]');
      const summary = languageSwitch.querySelector('summary');
      const triggerFlag = languageSwitch.querySelector('summary .mw-flag');
      const triggerCode = languageSwitch.querySelector(
        'summary .mw-lang-switch-code'
      );

      items.forEach((item) => {
        item.addEventListener('click', function () {
          const lang = item.dataset.mwLang;
          const nameElement = item.querySelector('.mw-lang-switch-name');
          const label = nameElement ? nameElement.textContent.trim() : lang;

          items.forEach((other) => {
            setActive(other, other === item);
            if (other === item) other.setAttribute('aria-current', 'true');
            else other.removeAttribute('aria-current');
          });

          if (triggerCode) triggerCode.textContent = lang;

          const itemFlag = item.querySelector('.mw-flag');
          if (triggerFlag && itemFlag) {
            triggerFlag.className = itemFlag.className;
          }

          if (summary) summary.setAttribute('aria-label', 'Language: ' + label);

          languageSwitch.dispatchEvent(
            new CustomEvent('mw-language-change', {
              bubbles: true,
              detail: { lang, name: label },
            })
          );
        });
      });
    });
  }

  // ===== Checkbox Lists =====
  function initCheckboxLists(root) {
    const checkboxLists = root.querySelectorAll(
      '.mw-item-list-checkbox, .mw-item-list-checkbox-scroll'
    );

    checkboxLists.forEach((list) => {
      if (!fresh(list)) return;
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
          toggleCheckboxRow(this);
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
  }

  // Public helper for toggling a checkbox row from application code. Prefixed
  // like the three below it - an unprefixed global is one collision away from
  // somebody else's toggleCheckbox. The list itself calls the local function,
  // so the behaviour does not depend on what the global is called.
  function toggleCheckboxRow(listItem) {
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
  }

  window.mwToggleCheckbox = toggleCheckboxRow;

  // A removable tag removes itself. Delegated, so the showcase needs no inline
  // onclick for it and a page with a Content-Security-Policy can use it.
  function initTagRemovals() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.mw-tags-remove');
      if (!button) return;

      const item = button.closest('.mw-tags-item');
      if (item) item.remove();
    });
  }

  // data-mw-copy="text to copy" on a button puts that text on the clipboard.
  // Empty value means: take it from the input the button sits next to, which
  // is what an input group with a copy button is.
  function initCopyButtons() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-mw-copy]');
      if (!button || !navigator.clipboard) return;

      const own = button.getAttribute('data-mw-copy');
      const field = button.closest('.mw-input-group')?.querySelector('input');
      const text = own || field?.value;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        button.dispatchEvent(
          new CustomEvent('mwCopied', { bubbles: true, detail: { text } })
        );
      });
    });
  }

  // ===== Gallery Component =====
  function initGalleries(root) {
    root.querySelectorAll('.mw-gallery').forEach((gallery) => {
      if (!fresh(gallery)) return;
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

    // Optional: Swipe support. The dominant axis decides, not the horizontal
    // distance alone - a finger scrolling the page down drifts sideways as it
    // goes, and 50px of that is not a swipe. Passive because neither handler
    // cancels the gesture, and without the flag the browser waits for them
    // before it may scroll.
    let startX = 0;
    let startY = 0;
    let swiping = false;

    track.addEventListener(
      'touchstart',
      (e) => {
        // A second finger is a pinch or a two-hand hold, never a swipe
        swiping = e.touches.length === 1;
        if (!swiping) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );

    track.addEventListener('touchcancel', () => (swiping = false));

    track.addEventListener(
      'touchend',
      (e) => {
        if (!swiping) return;
        swiping = false;
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = e.changedTouches[0].clientY - startY;
        if (Math.abs(deltaX) < 50) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
        goToSlide(current + (deltaX < 0 ? 1 : -1));
      },
      { passive: true }
    );

    goToSlide(0);
  }

  const ICON_PATHS = {
    close: 'M6 6l12 12M18 6L6 18',
    prev: 'M15 5l-7 7 7 7',
    next: 'M9 5l7 7-7 7',
  };

  function iconButton(className, label, name) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
      ICON_PATHS[name] +
      '"/></svg>';
    return button;
  }

  // The natural size once loaded, the width and height attributes before
  function mediaRatio(media) {
    const width =
      media.naturalWidth || media.videoWidth || +media.getAttribute('width');
    const height =
      media.naturalHeight || media.videoHeight || +media.getAttribute('height');
    return width && height ? width / height : 0;
  }

  // Read from the scroll position, so swipe, trackpad and arrows agree
  function stripControls(track, step, prev, next, onIndex) {
    function update() {
      const end = track.scrollWidth - track.clientWidth - 2;
      const last = track.children.length - 1;
      onIndex(
        track.scrollLeft >= end ? last : Math.round(track.scrollLeft / step())
      );
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= end;
    }

    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', update, { passive: true });
    return update;
  }

  // Past 1.4x off the frame's shape, a crop would cut away most of the photo
  function fitMedia(frame, media) {
    if (frame.classList.contains('mw-fit-cover')) return;
    const video = media.tagName === 'VIDEO';
    const forced = frame.classList.contains('mw-fit-contain');

    function apply() {
      if (!forced) {
        const ratio = mediaRatio(media);
        if (!ratio || !frame.clientHeight) return;

        const off = ratio / (frame.clientWidth / frame.clientHeight);
        frame.classList.toggle('mw-fit-contain', Math.max(off, 1 / off) >= 1.4);
      }

      const src = video ? media.poster : media.currentSrc || media.src;
      if (
        frame.classList.contains('mw-fit-contain') &&
        src &&
        !frame.querySelector(':scope > .mw-fit-backdrop')
      ) {
        const backdrop = document.createElement('img');
        backdrop.className = 'mw-fit-backdrop';
        backdrop.alt = '';
        backdrop.src = src;
        frame.prepend(backdrop);
      }
    }

    // Watched, not measured once: a frame in a closed tab has no shape yet
    new ResizeObserver(apply).observe(frame);
    media.addEventListener(video ? 'loadedmetadata' : 'load', apply);
  }

  // ===== Portrait Gallery =====
  function initPortraitGalleries(root) {
    root.querySelectorAll('.mw-portrait-gallery').forEach((gallery) => {
      if (fresh(gallery)) initPortraitGallery(gallery);
    });
  }

  function initPortraitGallery(gallery) {
    const track = gallery.querySelector('.mw-portrait-gallery-track');
    if (!track) return;
    const slides = Array.from(track.children);

    slides.forEach((slide) => {
      const media = slide.querySelector(':scope > img, :scope > video');
      if (media) fitMedia(slide, media);
    });

    if (slides.length < 2) return;

    const prev = iconButton(
      'mw-overlay-btn mw-portrait-gallery-prev',
      'Previous image',
      'prev'
    );
    const next = iconButton(
      'mw-overlay-btn mw-portrait-gallery-next',
      'Next image',
      'next'
    );
    const dots = document.createElement('div');
    dots.className = 'mw-portrait-gallery-dots';

    // Measured on every use: the slide width follows the container query
    const step = () => slides[1].offsetLeft - slides[0].offsetLeft;

    slides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mw-portrait-gallery-dot';
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', () => track.scrollTo({ left: i * step() }));
      dots.appendChild(dot);
    });

    gallery.append(prev, next, dots);
    stripControls(track, step, prev, next, (index) => {
      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle('mw-active', i === index);
      });
    })();
  }

  // ===== Mosaic =====
  function initMosaics(root) {
    root.querySelectorAll('.mw-mosaic-item').forEach((item) => {
      if (!fresh(item)) return;
      const img = item.querySelector('img');
      const shaped = ['mw-mosaic-wide', 'mw-mosaic-tall', 'mw-mosaic-big'].some(
        (name) => item.classList.contains(name)
      );
      if (!img || shaped) return;

      function shape() {
        const ratio = mediaRatio(img);
        if (ratio >= 1.3) item.classList.add('mw-mosaic-wide');
        else if (ratio && ratio <= 0.8) item.classList.add('mw-mosaic-tall');
        return ratio > 0;
      }

      if (!shape()) img.addEventListener('load', shape, { once: true });
    });
  }

  // ===== Lightbox =====
  function initLightbox() {
    let lightbox = null;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      const group = link && link.closest('.mw-mosaic, [data-mw-lightbox]');
      if (!group || !link.querySelector('img') || e.defaultPrevented) return;
      // A click meant to open the photo elsewhere stays a link
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      e.preventDefault();

      // In reading order, which a dense grid does not keep to the source one
      const links = Array.from(group.querySelectorAll('a[href]'))
        .filter((a) => a.querySelector('img'))
        .map((a) => ({ a, box: a.getBoundingClientRect() }))
        .sort(
          (x, y) => Math.round(x.box.top - y.box.top) || x.box.left - y.box.left
        )
        .map(({ a }) => a);
      lightbox = lightbox || createLightbox();
      lightbox.open(links, links.indexOf(link));
    });
  }

  function createLightbox() {
    const dialog = document.createElement('dialog');
    dialog.className = 'mw-lightbox';
    dialog.setAttribute('aria-label', 'Image viewer');

    const bar = document.createElement('div');
    bar.className = 'mw-lightbox-bar';
    const prev = iconButton(
      'mw-overlay-btn mw-lightbox-prev',
      'Previous image',
      'prev'
    );
    const next = iconButton(
      'mw-overlay-btn mw-lightbox-next',
      'Next image',
      'next'
    );
    const close = iconButton(
      'mw-overlay-btn mw-lightbox-close',
      'Close',
      'close'
    );
    close.autofocus = true;
    const count = document.createElement('span');
    count.className = 'mw-lightbox-count';
    count.setAttribute('aria-live', 'polite');
    const track = document.createElement('div');
    track.className = 'mw-lightbox-track';

    bar.append(prev, count, next, close);
    dialog.append(bar, track);
    document.body.appendChild(dialog);

    let links = [];
    let current = -1;

    function load(i) {
      const img = track.children[i] && track.children[i].querySelector('img');
      if (img && !img.src) img.src = img.dataset.src;
    }

    const update = stripControls(
      track,
      () => track.clientWidth,
      prev,
      next,
      (index) => {
        if (index === current) return;
        current = index;
        count.textContent = index + 1 + ' / ' + links.length;
        [index - 1, index, index + 1].forEach(load);
      }
    );

    close.addEventListener('click', () => dialog.close());

    // The stage around the photo is the backdrop here
    track.addEventListener('click', (e) => {
      if (e.target.classList.contains('mw-lightbox-slide')) dialog.close();
    });

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev.click();
      else if (e.key === 'ArrowRight') next.click();
    });

    // Back on the tile of the photo the reader stopped at, not the one opened
    dialog.addEventListener('close', () => {
      // The event arrives a task late; a viewer opened again by then stays
      if (dialog.open) return;
      if (links[current]) links[current].focus();
    });

    return {
      open(list, index) {
        links = list;
        current = -1;
        track.replaceChildren(...list.map(lightboxSlide));
        dialog.showModal();
        track.scrollTo({
          left: index * track.clientWidth,
          behavior: 'instant',
        });
        update();
      },
    };
  }

  function lightboxSlide(link) {
    const slide = document.createElement('figure');
    slide.className = 'mw-lightbox-slide';
    const img = document.createElement('img');
    img.dataset.src = link.href;
    img.alt = link.querySelector('img').alt;
    img.decoding = 'async';
    slide.appendChild(img);

    const figure = link.closest('figure');
    const caption = figure && figure.querySelector('figcaption');
    if (caption) {
      const text = document.createElement('figcaption');
      caption.childNodes.forEach((node) => text.append(node.cloneNode(true)));
      slide.appendChild(text);
    }
    return slide;
  }

  // ===== Story Reels =====
  // CSS plays the story; this adds tap steps, video on its turn, close at end
  function initStoryReels(root) {
    root.querySelectorAll('.mw-story-reel').forEach((reel) => {
      if (fresh(reel)) initStoryReel(reel);
    });
  }

  function initStoryReel(reel) {
    const frames = Array.from(
      reel.querySelectorAll(':scope > img, :scope > video')
    );
    const back = iconButton('mw-story-reel-prev', 'Previous', 'prev');
    const forward = iconButton('mw-story-reel-next', 'Next', 'next');
    const pause = reel.querySelector('.mw-story-reel-pause input');
    const close = reel.querySelector('[popovertargetaction="hide"]');
    // The popover focuses it on open, so the arrow keys reach the reel at once
    if (close) close.autofocus = true;
    reel.append(back, forward);

    const clocks = () =>
      reel
        .getAnimations({ subtree: true })
        .filter((animation) => animation instanceof CSSAnimation);

    // The fill runs through the whole story, so it tells the current frame
    function current() {
      const fill = clocks().find(
        (animation) => animation.animationName === 'mw-story-reel-fill'
      );
      if (!fill) return null;
      // Frames past the ones the stylesheet times are hidden and do not count
      const count = frames.filter(
        (frame) => getComputedStyle(frame).display !== 'none'
      ).length;
      const length = fill.effect.getTiming().duration / count;
      return { count, length, index: Math.floor(fill.currentTime / length) };
    }

    function play(frame) {
      frames.forEach((other) => {
        if (other.tagName === 'VIDEO' && other !== frame) other.pause();
      });
      if (!frame || frame.tagName !== 'VIDEO') return;
      frame.currentTime = 0;
      if (!pause || !pause.checked) frame.play().catch(() => {});
    }

    function step(delta) {
      const now = current();
      if (!now) return;
      const target = Math.max(now.index + delta, 0);
      if (target >= now.count) {
        reel.hidePopover();
        return;
      }
      // Past the 1ms reveal by a margin, or rounding lands just short of it
      const time = target * now.length + 20;
      clocks().forEach((animation) => (animation.currentTime = time));
      play(frames[target]);
    }

    // The video on screen keeps to the story's clock: held or paused, it stops
    function syncVideo(held) {
      const now = reel.matches(':popover-open') && current();
      const frame = now && frames[now.index];
      if (!frame || frame.tagName !== 'VIDEO') return;
      if (held || (pause && pause.checked)) frame.pause();
      else frame.play().catch(() => {});
    }

    // A hold pauses the story in CSS; letting go must not also step it
    let pressed = 0;
    reel.addEventListener('pointerdown', (e) => {
      pressed = e.timeStamp;
      syncVideo(true);
    });
    ['pointerup', 'pointercancel'].forEach((type) => {
      reel.addEventListener(type, () => syncVideo(false));
    });

    function onTap(delta) {
      return (e) => {
        if (e.detail && e.timeStamp - pressed > 250) return;
        step(delta);
      };
    }

    back.addEventListener('click', onTap(-1));
    forward.addEventListener('click', onTap(1));

    // A seek backwards ends the reveals it skips too; only the current frame plays
    reel.addEventListener('animationend', (e) => {
      if (e.animationName === 'mw-story-reel-fill') {
        reel.hidePopover();
      } else if (e.animationName === 'mw-story-reel-frame') {
        const now = current();
        if (now && frames[now.index] === e.target) play(e.target);
      }
    });

    reel.addEventListener('toggle', (e) => {
      play(e.newState === 'open' ? frames[0] : null);
    });

    if (pause) pause.addEventListener('change', () => syncVideo(false));

    reel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  // ===== Theme Toggle =====
  function initThemeToggle() {
    const themeToggle = document.querySelector('.mw-theme-toggle');
    if (!themeToggle) return;

    const root = document.documentElement;
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

      // Ensure the theme classes are gone for fixed mode
      root.classList.remove('mw-theme-light', 'mw-theme-dark');

      return;
    }

    // mode switchable - only runs if themeMode === 'switchable'
    const systemLight = window.matchMedia('(prefers-color-scheme: light)');

    // Only trust the OS where the stylesheet can act on it. Without light-dark()
    // the theme tokens sit on :root as the dark set and the light one arrives by
    // class alone, so a light machine would get a sun icon over a dark page.
    const followsSystem =
      window.CSS && CSS.supports('color', 'light-dark(#000, #fff)');
    const preferred = () => followsSystem && systemLight.matches;

    const stored = localStorage.getItem('mw-theme');
    let isLight = stored ? stored === 'light' : preferred();

    // Function to apply theme styles and icon
    const applyTheme = (lightMode) => {
      // The forced reflow is the point: the new colours land while transitions are off
      root.classList.add('mw-theme-switching');
      // On <html> and not on <body>: a script in the <head> runs before the
      // body exists, and that script is the only way to apply a stored choice
      // before the first paint instead of flashing the other theme first.
      root.classList.toggle('mw-theme-light', lightMode);
      // The explicit counterpart, for dark on a machine set to light - without it
      // the page would follow the OS straight back past the reader's choice
      root.classList.toggle('mw-theme-dark', !lightMode);
      void root.offsetHeight;
      root.classList.remove('mw-theme-switching');

      setActive(themeToggle, lightMode);
      if (icon) {
        icon.className = lightMode ? 'fas fa-sun' : 'fas fa-moon';
      }
    };

    // Set initial theme based on isLight
    applyTheme(isLight);

    // Until the reader picks a side, the page keeps tracking the OS switch
    systemLight.addEventListener('change', () => {
      if (localStorage.getItem('mw-theme')) return;
      isLight = preferred();
      applyTheme(isLight);
      updateColorSwatchHexValues();
    });

    // Add click listener for switching
    themeToggle.addEventListener('click', () => {
      isLight = !isLight;
      applyTheme(isLight);
      localStorage.setItem('mw-theme', isLight ? 'light' : 'dark'); // Save

      // No transition left to wait out, so the swatches can read the new values now
      updateColorSwatchHexValues();
    });
  }

  // ===== Color Swatches =====
  function initColorSwatches() {
    updateColorSwatchHexValues();
  }

  function updateColorSwatchHexValues() {
    const colorSwatches = Array.from(
      document.querySelectorAll('.color-swatch')
    );

    // All reads before the first write - a write between two reads forces a recalc
    const hexValues = colorSwatches.map((swatch) =>
      rgbToHex(window.getComputedStyle(swatch).backgroundColor)
    );

    colorSwatches.forEach((swatch, index) => {
      const hexTextElement =
        swatch.parentElement.querySelector('.mw-text-muted');
      if (hexTextElement) {
        hexTextElement.textContent = hexValues[index];
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
  function initAccordions(root) {
    const accordionHeaders = root.querySelectorAll('.mw-accordion-header');
    accordionHeaders.forEach((header) => {
      if (!fresh(header)) return;
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

    // aria-expanded only on a real control - on a <div> it claims a state for nothing
    const announces = menuBtn.tagName === 'BUTTON';

    function setOpen(open) {
      menuBtn.classList.toggle('mw-active', open);
      navbar.classList.toggle('mw-active', open);
      // The scrim and the rules that pin the bar and the burger in place hang
      // off this one class rather than off `:has(.mw-navbar.mw-active)` - a selector
      // that has to re-match the whole document from a class change several
      // levels down, which is where WebKit's invalidation has let it slip.
      document.body.classList.toggle('mw-nav-open', open);
      if (announces) menuBtn.setAttribute('aria-expanded', String(open));
    }

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!navbar.classList.contains('mw-active'));
    }

    // One listener, not two. The button carries touch-action: manipulation, so
    // its click arrives without the 300ms wait that the extra touchstart was
    // there to skip - and with both, a touch fires the toggle twice on any
    // engine that still synthesises the click.
    menuBtn.addEventListener('click', toggleMenu);

    // The scrim is a body pseudo-element, so its taps land on the document
    document.addEventListener('click', function (e) {
      if (!navbar.classList.contains('mw-active')) return;
      if (navbar.contains(e.target) || menuBtn.contains(e.target)) return;
      setOpen(false);
    });

    // Or Escape strands the keyboard user in a panel that is no longer there
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!navbar.classList.contains('mw-active')) return;
      setOpen(false);
      menuBtn.focus();
    });
  }

  // ===== Progress Bars =====

  // The fill is driven from CSS where the browser can do it (_progress.scss), so
  // this only hands the target width over and switches the animation on
  function initProgressBars(root) {
    const fills = Array.from(root.querySelectorAll('.mw-progress-fill')).filter(
      fresh
    );
    if (!fills.length) return;

    const scrollDriven = CSS.supports('animation-timeline', 'view()');

    // Two spellings in the wild: data-value="75" and style="width: 75%".
    const targetWidth = (bar) =>
      bar.dataset.value ? bar.dataset.value + '%' : bar.style.width;

    const driven = [];
    fills.forEach((bar) => {
      const target = targetWidth(bar);
      if (!target) return;
      bar.style.setProperty('--mw-progress-value', target);
      if (scrollDriven) bar.classList.add('mw-progress-driven');
      else driven.push(bar);
    });

    if (scrollDriven) return;

    // Fallback: set the width once, when the bar comes into view, and let the
    // transition in _progress.scss animate it. Only bars whose target is known -
    // a bar already carrying its width in the markup is left alone.
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.width = targetWidth(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { root: null, threshold: 0.2 }
    );

    driven.forEach((bar) => obs.observe(bar));
  }

  // ===== Scroll Reveal =====

  // The cards ride the browser's own view timeline where there is one
  // (_reveal.scss). Older Safari and Firefox have none, so there an observer
  // stands in: hide what is still below the fold, run the same keyframes when
  // it arrives.
  function initReveals(root) {
    if (CSS.supports('animation-timeline', 'view()')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(
      root.querySelectorAll('.mw-reveal, .mw-reveal-stagger > *')
    ).filter(fresh);
    if (!targets.length) return;

    // The wave the grid draws in CSS, rebuilt from the column count the browser
    // actually rendered - cheaper than restating every grid's stagger cycle a
    // second time, and right on a phone where the grid collapses to one column.
    const staggerDelay = (el) => {
      const grid = el.parentElement;
      if (!grid || !grid.classList.contains('mw-reveal-stagger')) return 0;
      const columns =
        getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      return ([...grid.children].indexOf(el) % columns) * 90;
    };

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          entry.target.style.animationDelay = staggerDelay(entry.target) + 'ms';
          entry.target.classList.replace('mw-reveal-hidden', 'mw-reveal-run');
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => {
      // Whatever is on screen already has passed its entry range in a browser
      // with timelines too, so it stays put instead of fading in after load
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('mw-reveal-hidden');
      obs.observe(el);
    });
  }

  // Same story for the header that rides in over the first stretch of scroll
  // (_header-reveal.scss). A toggle and not a scrub: mapping scroll to progress
  // by hand would cost a rAF loop for a bar that is only ever in one of two
  // places anyway.
  function initHeaderReveal() {
    const header = document.querySelector('.mw-header-reveal');
    if (!header) return;
    if (CSS.supports('animation-timeline', 'scroll()')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ribbon = document.querySelector(
      '.mw-announcement:not(.mw-announcement-static)'
    );

    // The CSS range holds the bar away for the first 30% of 420px and has it
    // fully in at the end - halfway through what is left is the closest a
    // single threshold gets to that.
    const threshold = 270;
    let away = null;

    const update = () => {
      const next = window.scrollY < threshold;
      if (next === away) return;
      away = next;
      header.classList.toggle('mw-header-away', next);
      if (ribbon) ribbon.classList.toggle('mw-announcement-away', next);
    };

    update();

    // A frame later, or the bar starts at the top and slides away in front of
    // the reader - the transition would be armed before it is in position.
    requestAnimationFrame(() => {
      header.classList.add('mw-header-driven');
      if (ribbon) ribbon.classList.add('mw-announcement-driven');
    });

    window.addEventListener('scroll', update, { passive: true });
  }

  // And the parallax layers (_parallax.scss), the one of the four that needs a
  // frame loop: the picture does not arrive somewhere, it is somewhere else at
  // every scroll position. Only the progress is written, the travel stays in
  // CSS where the depth variants can still reach it.
  function initParallax() {
    if (CSS.supports('animation-timeline', 'view()')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const media = document.querySelectorAll('.mw-parallax-media');
    if (!media.length) return;

    // A pinned block never travels through the viewport, so its own timeline
    // would stand still - the CSS plays it against the document's first screen
    // instead, and so does this.
    const layers = [...media].map((el) => {
      el.classList.add('mw-parallax-driven');
      return { el, pinned: Boolean(el.closest('.mw-parallax-sticky')) };
    });

    const clamp = (value) => Math.min(1, Math.max(0, value));

    // What view() hands the animation over its cover pass: 0 when the top edge
    // touches the bottom of the screen, 1 when the bottom edge leaves at the
    // top. Clamped, because the fill holds a layer at whichever end is off
    // screen.
    const progress = (layer, viewport) => {
      if (layer.pinned) return clamp(window.scrollY / viewport);
      const rect = layer.el.getBoundingClientRect();
      return clamp((viewport - rect.top) / (viewport + rect.height));
    };

    let queued = false;

    const update = () => {
      queued = false;
      // The layout viewport, not innerHeight: on a phone that one is the visual
      // viewport and grows by up to a hundred pixels as the URL bar slides away
      // mid-scroll, which steps every layer at once. clientHeight only moves on
      // a real resize.
      const viewport = document.documentElement.clientHeight;
      // Every read before the first write, or each write makes the next read
      // lay the page out again - a reflow per layer per frame.
      const values = layers.map((layer) => progress(layer, viewport));
      layers.forEach((layer, i) =>
        layer.el.style.setProperty('--mw-parallax-progress', values[i])
      );
    };

    const request = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
  }

  // ===== Smooth Scrolling =====
  // Where an anchor jump lands: scroll-padding-top, read per run because the
  // ribbon grows on small screens and can be dismissed
  function anchorOffset() {
    const padding = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop
    );
    return Number.isNaN(padding) ? 0 : padding;
  }

  // Anything the user does with the wheel or a finger outranks a running glide
  let glide = null;
  ['wheel', 'touchstart'].forEach((type) => {
    window.addEventListener(type, () => (glide = null), { passive: true });
  });

  function initSmoothScrolling() {
    // A sticky target reports where it is pinned, not where it sits in the flow,
    // and pinned is the top of the screen - so the browser's own jump moved the
    // page by the header offset and stopped there. offsetTop follows it to the
    // pin as well, so the position is taken with the pinning switched off. No
    // paint happens in between, the style is back before the frame ends.
    function documentTop(el) {
      const inline = el.style.position;
      const pinned = getComputedStyle(el).position === 'sticky';
      if (pinned) el.style.position = 'static';
      const y = el.getBoundingClientRect().top + window.scrollY;
      if (pinned) el.style.position = inline;
      return y;
    }

    function glideTo(targetY) {
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (!distance) return;

      // Scaled, or a jump to the next section takes as long as one across the
      // whole page; capped, or that one crawls
      const duration = Math.min(2000, 600 + Math.abs(distance) * 0.5);
      const token = {};
      glide = token;

      // The clock starts on the first rendered frame and not on the click. The
      // page can sit still for a few hundred ms between the two - a clock
      // started at the click hands that time to the easing, and the scroll
      // opens by jumping most of the way at once.
      let start = null;

      function step(now) {
        if (glide !== token) return;
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // 'instant', or the smooth scroll-behavior in the stylesheet animates
        // every single step of this animation on top of it
        window.scrollTo({
          top: startY + distance * eased,
          behavior: 'instant',
        });
        if (t < 1) requestAnimationFrame(step);
        else glide = null;
      }

      requestAnimationFrame(step);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const menuBtn = document.querySelector('.mw-menu-btn');
        const nav = document.querySelector('.mw-navbar');
        if (menuBtn && nav) {
          menuBtn.classList.remove('mw-active');
          nav.classList.remove('mw-active');
          document.body.classList.remove('mw-nav-open');
          if (menuBtn.tagName === 'BUTTON') {
            menuBtn.setAttribute('aria-expanded', 'false');
          }
        }

        e.preventDefault();
        const target = Math.max(0, documentTop(targetElement) - anchorOffset());

        // The browser moves focus on an anchor jump of its own; preventDefault
        // takes that away, and a skip link that only scrolls leaves the next Tab
        // back where it started. -1 keeps the target out of the tab order.
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });

        // Not `behavior: 'smooth'`: the browser's own curve takes no duration,
        // and the one it picks cannot be slowed down.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          window.scrollTo({ top: target, behavior: 'instant' });
        } else {
          glideTo(target);
        }

        // replaceState and not the default hash change: the glide is the
        // navigation, and a history entry per section link buries the page the
        // user arrived from
        history.replaceState(null, '', targetId);
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
        // +2 absorbs subpixel rounding between the jump and the scroll position
        const offset = anchorOffset() + 2;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop - offset;
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
      }, 100),
      { passive: true }
    );
  }

  // The strip draws the marker, this only hands over position and length as custom
  // properties. Both axes every time - which pair the bar uses is the stylesheet's
  // decision, at a breakpoint this file knows nothing of. The attribute switches
  // the bar on and is set after the first measurement, so a page without script
  // keeps the plain border and still looks finished.
  function measureTabsMarker(nav) {
    const active = nav.querySelector(
      '.mw-tabs-nav-item.mw-active, .mw-tabs-nav-item.active'
    );
    if (!active) {
      nav.removeAttribute('data-mw-tabs-marker');
      return;
    }

    // Unitless for the scale factors: the bar is 1px long and scaled up.
    nav.style.setProperty('--mw-tabs-marker-x', active.offsetLeft + 'px');
    nav.style.setProperty('--mw-tabs-marker-w', active.offsetWidth);
    nav.style.setProperty('--mw-tabs-marker-y', active.offsetTop + 'px');
    nav.style.setProperty('--mw-tabs-marker-h', active.offsetHeight);
    nav.setAttribute('data-mw-tabs-marker', '');
  }

  // Set here and not in the markup, so a page that already ships .mw-tabs gets the
  // tablist semantics by loading the script
  function initTabs(root) {
    root.querySelectorAll('.mw-tabs-nav').forEach((nav) => {
      if (!fresh(nav)) return;
      const items = Array.from(nav.querySelectorAll('.mw-tabs-nav-item'));
      if (!items.length) return;

      const vertical = !!nav.closest('.mw-tabs-vertical');

      nav.setAttribute('role', 'tablist');
      if (vertical) nav.setAttribute('aria-orientation', 'vertical');

      items.forEach((item, index) => {
        const panel = tabPanelOf(item);

        item.setAttribute('role', 'tab');
        if (!item.id) item.id = (panel ? panel.id : 'mw-tab-' + index) + '-tab';

        if (panel) {
          item.setAttribute('aria-controls', panel.id);
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', item.id);
        }

        syncTabState(item);

        item.addEventListener('click', () => selectTab(items, item));

        item.addEventListener('keydown', (event) => {
          const target = tabKeyTarget(event, vertical, items.length, index);
          if (target === null) return;
          event.preventDefault();
          selectTab(items, items[target]);
          items[target].focus();
        });
      });

      measureTabsMarker(nav);

      // The items are watched too: a web font arriving moves the label the bar is
      // parked under without the strip itself changing size
      const observer = new ResizeObserver(() => measureTabsMarker(nav));
      observer.observe(nav);
      items.forEach((item) => observer.observe(item));
    });
  }

  function tabPanelOf(item) {
    const id = item.getAttribute('data-tab');
    return id ? document.getElementById(id) : null;
  }

  function syncTabState(item) {
    const on = isActive(item);
    item.setAttribute('aria-selected', String(on));
    item.tabIndex = on ? 0 : -1;
  }

  function selectTab(items, item) {
    items.forEach((other) => {
      const on = other === item;
      setActive(other, on);
      setActive(tabPanelOf(other), on);
      syncTabState(other);
    });

    const nav = item.closest('.mw-tabs-nav');
    if (nav) measureTabsMarker(nav);
  }

  function tabKeyTarget(event, vertical, count, index) {
    const back = vertical ? 'ArrowUp' : 'ArrowLeft';
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';

    if (event.key === back) return (index - 1 + count) % count;
    if (event.key === forward) return (index + 1) % count;
    if (event.key === 'Home') return 0;
    if (event.key === 'End') return count - 1;
    return null;
  }

  // ===== Alerts =====
  function initAlerts(root) {
    const alertCloseButtons = root.querySelectorAll('.mw-alert-close');

    alertCloseButtons.forEach((button) => {
      if (!fresh(button)) return;
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
  function isLocalhost() {
    const host = window.location.hostname;
    return (
      host === 'localhost' || host === '127.0.0.1' || host.includes('192.168.')
    );
  }

  function initLocalhostIndicator() {
    const activated = document.querySelector(
      '.mw-localhost-indicator-activated'
    );
    const header = document.querySelector('.mw-header');

    if (activated && isLocalhost()) {
      const indicator = document.createElement('div');
      indicator.className = 'mw-localhost-indicator-pulse';
      header.prepend(indicator);
    }
  }

  // iOS resolves every safe-area inset to 0 without it, so the gutter, the nav
  // panel and the modals lose their cutout budget - silently, hence the warning.
  function warnMissingViewportFit() {
    if (!isLocalhost()) return;

    const meta = document.querySelector('meta[name="viewport"]');
    const content = meta ? meta.getAttribute('content') || '' : '';
    if (/viewport-fit\s*=\s*cover/.test(content)) return;

    console.warn(
      'MaverickWave: <meta name="viewport"> is missing viewport-fit=cover. ' +
        'env(safe-area-inset-*) resolves to 0 without it, so notched phones ' +
        'lose the gutter, the nav panel and the modal padding that expect it.'
    );
  }

  // ===== Form Sliders =====
  function initFormSliders(root) {
    root.querySelectorAll('.mw-slider-container').forEach((wrapper) => {
      if (!fresh(wrapper)) return;
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

  // Two shapes: the older `mw-modal-overlay` div toggled by class, and `<dialog>`,
  // where focus trap, Escape and the inert background are the browser's job.
  // Delegated, so a modal added later works too.
  function initModals() {
    document.addEventListener('click', (e) => {
      const closer = e.target.closest('.mw-modal-close');
      if (closer) {
        const dialog = closer.closest('dialog.mw-modal');
        if (dialog) {
          dialog.close();
          return;
        }
        const overlay = closer.closest('.mw-modal-overlay');
        if (overlay) overlay.classList.remove('mw-modal-open');
        return;
      }

      const opener = e.target.closest('[data-mw-modal]');
      if (opener) {
        openModal(document.getElementById(opener.dataset.mwModal));
        return;
      }

      // Light dismiss for a dialog the browser does not dismiss itself. A click
      // that lands on the dialog element is a click on the backdrop - the
      // content sits in .mw-modal-header/body/footer inside it.
      if (
        e.target.matches('dialog.mw-modal[open]') &&
        !dismissesItself(e.target)
      ) {
        e.target.close();
      }
    });
  }

  // True when `closedby` is on the element *and* understood, which is the only
  // case where the browser closes the dialog on a backdrop click by itself.
  function dismissesItself(dialog) {
    return 'closedBy' in dialog && dialog.getAttribute('closedby') !== null;
  }

  // Opens either shape. Exposed, because which modal opens when is the
  // application's decision and not something markup can express on its own.
  function openModal(modal) {
    if (!modal) return;
    if (modal.tagName === 'DIALOG') {
      modal.showModal();
    } else {
      modal.classList.add('mw-modal-open');
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    if (modal.tagName === 'DIALOG') {
      modal.close();
    } else {
      modal.classList.remove('mw-modal-open');
    }
  }

  window.mwOpenModal = (id) => openModal(document.getElementById(id));
  window.mwCloseModal = (id) => closeModal(document.getElementById(id));
  // The swatch hex labels read the computed colour, so anything that changes a
  // root colour at runtime has to ask for them to be read again
  window.mwRefreshColorSwatches = updateColorSwatchHexValues;

  // ===== Image Sliders =====
  function initImageSliders(root) {
    const sliders = root.querySelectorAll('.mw-image-slider');

    sliders.forEach((slider) => {
      if (!fresh(slider)) return;
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
  function initKanbanBoards(root) {
    root.querySelectorAll('.mw-kanban').forEach((board) => {
      if (fresh(board)) initKanbanBoard(board);
    });
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

      // Re-parenting alone makes the card blink into the other column, so it comes
      // in from the side it was pushed from. Both classes come off first with a
      // forced reflow between, or a second push in the same direction is silent.
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
  function initCalendars(root) {
    root.querySelectorAll('[data-calendar]').forEach((calendar) => {
      if (fresh(calendar)) initCalendar(calendar);
    });
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
