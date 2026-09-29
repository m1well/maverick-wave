// The header is one partial on every page, so the page it stands on is marked here
{
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mw-header .mw-navbar-link').forEach((link) => {
    if (link.getAttribute('href') === page) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// just for the showcase (login button triggers login error)
document.addEventListener('DOMContentLoaded', () => {
  const loginCard = document.querySelector('.mw-login');
  const form = document.getElementById('login-form');
  if (form) {
    const btn = form.querySelector('.mw-btn-primary');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.classList.remove('mw-login-error');
        void loginCard.offsetWidth;
        loginCard.classList.add('mw-login-error');
        setTimeout(() => {
          loginCard.classList.remove('mw-login-error');
        }, 4000);
      });
    }
  }
});

// just for the showcase: one segmented switch above the offer grid drives
// every card in it. The framework ships the look, not the arithmetic - a
// real application has its own prices and its own state, so this stays
// here rather than in maverick-wave.js.
document.addEventListener('DOMContentLoaded', () => {
  const cycleSwitch = document.getElementById('cycle-switch');
  const offers = document.getElementById('cycle-offers');
  if (!cycleSwitch || !offers) return;

  // Trailing zero cents are noise on a price - "24 Euro", not "24,00
  // Euro". The tabular figures keep the row from jumping anyway.
  const money = (n) => {
    const fixed = n.toFixed(2);
    return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed.replace('.', ',');
  };

  const apply = (button) => {
    const months = Number(button.dataset.cycle);
    const off = Number(button.dataset.cycleOff || 0);

    cycleSwitch.querySelectorAll('.mw-segmented-item').forEach((item) => {
      const on = item === button;
      item.classList.toggle('mw-active', on);
      item.setAttribute('aria-pressed', String(on));
    });

    offers.querySelectorAll('.mw-offer').forEach((card) => {
      const rate = Number(card.dataset.rate);
      const perMonth = rate * (1 - off / 100);
      const [whole, cents] = money(perMonth).split(',');

      card.querySelector('[data-price-amount]').innerHTML = cents
        ? whole + '<span class="mw-price-fraction">,' + cents + '</span>'
        : whole;

      const original = card.querySelector('.mw-price-original');
      original.hidden = off === 0;
      original.querySelector('[data-price-rate]').textContent = money(rate);

      const tag = card.querySelector('[data-price-off]');
      tag.hidden = off === 0;
      tag.textContent = '-' + off + '%';

      card.querySelector('[data-price-billing]').textContent =
        off === 0
          ? button.dataset.cycleLabel + '.'
          : money(perMonth * months) +
            ' Euro ' +
            button.dataset.cycleLabel +
            '.';
    });
  };

  cycleSwitch.querySelectorAll('.mw-segmented-item').forEach((item) => {
    item.addEventListener('click', () => apply(item));
  });
  apply(cycleSwitch.querySelector('.mw-active'));
});

// just for the showcase: the switches above the photo layouts put one of
// their modifiers on the demo they name and take the others off
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-modifier-demo]').forEach((group) => {
    const target = document.getElementById(group.dataset.modifierDemo);
    const items = group.querySelectorAll('.mw-segmented-item');
    items.forEach((item) => {
      item.setAttribute(
        'aria-pressed',
        String(item.classList.contains('mw-active'))
      );
      item.addEventListener('click', () => {
        items.forEach((other) => {
          other.classList.toggle('mw-active', other === item);
          other.setAttribute('aria-pressed', String(other === item));
          if (other.dataset.modifier) {
            target.classList.remove(other.dataset.modifier);
          }
        });
        if (item.dataset.modifier) {
          target.classList.add(item.dataset.modifier);
        }
      });
    });
  });
});

// just for the showcase: the palette switcher. Every tone in the framework
// is derived from the root colors with color-mix(), so writing those on the
// root element repaints the page - bar, ink, borders and tints included.
// The colours travel between the pages as part of the setup kept below.
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('palette-toggle');
  const panel = document.getElementById('palette-panel');
  const primaryInput = document.getElementById('palette-primary');
  const secondaryInput = document.getElementById('palette-secondary');
  const items = [...document.querySelectorAll('.palette-item')];
  if (!toggleBtn || !panel) return;

  const root = document.documentElement;

  // The values the markup ships with, so the setup box below can tell a
  // chosen colour from the built-in one and print only the difference
  const BUILT_IN = {
    primary: primaryInput.value,
    secondary: secondaryInput.value,
  };

  const DARK_INK = '#131925';
  const LIGHT_INK = '#f2f6fc';

  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrast = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  };

  // Measured, not thresholded - a lightness cutoff gets a saturated mid
  // tone wrong
  const ink = (fill) =>
    contrast(fill, DARK_INK) > contrast(fill, LIGHT_INK) ? DARK_INK : LIGHT_INK;

  // Cuts the transition the new colours started: the whole page
  // interpolating at once is the expensive part, and the hex labels in the
  // Colors section read computed values, so they need the landed ones
  const settle = () => {
    root.classList.add('mw-theme-switching');
    void root.offsetHeight;
    root.classList.remove('mw-theme-switching');
    window.mwRefreshColorSwatches?.();
    window.mwRefreshSetup?.();
  };

  const paint = (name, color) => {
    root.style.setProperty(`--mw-${name}-color`, color);
    root.style.setProperty(`--mw-${name}-accent-text-color`, ink(color));
  };

  items.forEach((item) => {
    const { primary, secondary, dark, light } = item.dataset;
    item.style.setProperty('--swatch-primary', primary);
    item.style.setProperty('--swatch-secondary', secondary);

    item.addEventListener('click', () => {
      items.forEach((other) =>
        other.classList.toggle('mw-active', other === item)
      );
      paint('primary', primary);
      paint('secondary', secondary);
      root.style.setProperty('--mw-dark-page-background', dark);
      root.style.setProperty('--mw-light-page-background', light);
      primaryInput.value = primary;
      secondaryInput.value = secondary;
      settle();
    });
  });

  // A hand-picked color belongs to no preset - the page backgrounds stay put
  [
    ['primary', primaryInput],
    ['secondary', secondaryInput],
  ].forEach(([name, input]) => {
    input.addEventListener('input', () => {
      items.forEach((item) => item.classList.remove('mw-active'));
      paint(name, input.value);
    });
    // Dragging the picker fires `input` per pixel - the rest waits for the end
    input.addEventListener('change', settle);
  });

  const preview = document.getElementById('preview');

  const toggle = (open) => {
    panel.hidden = !open;
    toggleBtn.setAttribute('aria-expanded', String(open));

    // Only the start page has a preview; `instant`, or the jump animates
    if (open) preview?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };

  toggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggle(panel.hidden);
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !panel.contains(event.target)) toggle(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') toggle(false);
  });

  // The seam to the variants panel below, which prints and reads the whole
  // setup - the palette is half of it. Only inline values count as chosen:
  // anything still coming from the stylesheet is the built-in one.
  const PAGE_GROUNDS = {
    dark: '--mw-dark-page-background',
    light: '--mw-light-page-background',
  };

  window.mwPalette = {
    read: () => ({
      primary: root.style.getPropertyValue('--mw-primary-color') || null,
      secondary: root.style.getPropertyValue('--mw-secondary-color') || null,
      // The label colour ink() measured for each fill. It has to travel
      // with the setup: a project that only copies the two brand colours
      // keeps the stock accent text, and on a light brand tone that is an
      // unreadable button. write() recomputes it, so pasting it back is
      // harmless.
      primaryInk:
        root.style.getPropertyValue('--mw-primary-accent-text-color') || null,
      secondaryInk:
        root.style.getPropertyValue('--mw-secondary-accent-text-color') || null,
      dark: root.style.getPropertyValue(PAGE_GROUNDS.dark) || null,
      light: root.style.getPropertyValue(PAGE_GROUNDS.light) || null,
    }),

    write: ({ primary, secondary, dark, light }) => {
      const current = window.mwPalette.read();
      const same =
        current.primary === primary &&
        current.secondary === secondary &&
        current.dark === dark &&
        current.light === light;

      // Before the early exit: the head script may have painted these already
      const shownPrimary = primary || BUILT_IN.primary;
      const shownSecondary = secondary || BUILT_IN.secondary;
      primaryInput.value = shownPrimary;
      secondaryInput.value = shownSecondary;
      items.forEach((item) =>
        item.classList.toggle(
          'mw-active',
          item.dataset.primary === shownPrimary &&
            item.dataset.secondary === shownSecondary
        )
      );

      // Typing into the setup box fires per keystroke, and settle() forces
      // a reflow - so a run that changes nothing has to cost nothing
      if (same) return;

      [
        ['primary', primary],
        ['secondary', secondary],
      ].forEach(([name, value]) => {
        if (value) {
          paint(name, value);
        } else {
          root.style.removeProperty(`--mw-${name}-color`);
          root.style.removeProperty(`--mw-${name}-accent-text-color`);
        }
      });

      Object.entries(PAGE_GROUNDS).forEach(([key, prop]) => {
        const value = key === 'dark' ? dark : light;
        if (value) root.style.setProperty(prop, value);
        else root.style.removeProperty(prop);
      });

      settle();
    },
  };
});

// just for the showcase: the variant switches. Each one is a class on <html>
// or a single custom property, never a walk over the DOM - markup that
// arrives later (a modal, a toast, a kanban card) is covered by the same
// class that was already set. The readout at the bottom of the panel is the
// whole setup a project would carry to get the look it is currently seeing.
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('variant-list');
  const setup = document.getElementById('variant-setup');
  if (!list || !setup) return;

  const root = document.documentElement;
  const controls = [...list.querySelectorAll('input, select')];

  // Built on every render, put into the address bar by nobody: a setup
  // written to the URL as you go comes back on the next reload, and then
  // the showcase opens in someone else's look for good. Copy link is the
  // one way out of here, and what it hands over is this.
  //
  // URLSearchParams and not a hand-rolled separator: a value like the
  // heading font or the page width is full of commas, quotes and brackets,
  // and escaping those by hand is where this kind of thing breaks.
  let shareUrl = location.origin + location.pathname;

  const setupQuery = (classes, dropped, pairs) => {
    const params = new URLSearchParams();
    if (classes.length) params.set('c', classes.join(' '));
    if (dropped.length) params.set('d', dropped.join(' '));
    pairs.forEach(([prop, value]) => params.set(prop, value));
    return params.toString();
  };

  // Kept for the tab, so the look follows the reader from page to page
  const SESSION_KEY = 'mw-showcase-setup';
  const keep = (query) => {
    try {
      sessionStorage.setItem(SESSION_KEY, query);
    } catch {}
  };
  const kept = () => {
    try {
      return sessionStorage.getItem(SESSION_KEY) ?? '';
    } catch {
      return '';
    }
  };

  // Back into the shape load() reads, so the link and a pasted setup go
  // through one parser rather than two that can drift apart. The target in
  // front of `: no` is only there to make the line read like the printed
  // one - load() matches on the class name alone.
  const readSetup = (query) => {
    const params = new URLSearchParams(query);
    const lines = [];

    const classes = params.get('c');
    if (classes) lines.push('html class="' + classes + '"');

    (params.get('d') || '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => lines.push('markup: no ' + name));

    const pairs = [...params.entries()].filter(([key]) => key.startsWith('--'));
    if (pairs.length) {
      lines.push(
        ':root {',
        ...pairs.map(([key, value]) => `  ${key}: ${value};`),
        '}'
      );
    }

    return lines.length ? lines.join('\n') : null;
  };

  const isOn = (input) =>
    input.hasAttribute('data-variant-invert') ? !input.checked : input.checked;

  const render = () => {
    const classes = [];
    // Unformatted, because both the box and the link are written from
    // these and formatting only one of the two ways is a bug waiting
    const notes = [];
    const pairs = [];

    // The palette is part of the setup, and it is printed first because a
    // project sets its brand colours before it retunes anything else
    const palette = window.mwPalette?.read() ?? {};
    [
      ['--mw-primary-color', palette.primary],
      ['--mw-primary-accent-text-color', palette.primaryInk],
      ['--mw-secondary-color', palette.secondary],
      ['--mw-secondary-accent-text-color', palette.secondaryInk],
      ['--mw-dark-page-background', palette.dark],
      ['--mw-light-page-background', palette.light],
    ].forEach(([prop, value]) => {
      if (value) pairs.push([prop, value]);
    });

    controls.forEach((control) => {
      if (control.type !== 'checkbox') {
        // A select whose options are class names picks one of a set the
        // markup cannot hold at the same time - a shape is one or none
        if (!control.value) return;
        if (control.hasAttribute('data-variant-classes')) {
          classes.push(control.value);
        } else {
          pairs.push([control.dataset.variantProp, control.value]);
        }
        return;
      }

      // A targeted class is one the markup already ships, so its absence is
      // the deviation worth naming - the rest are classes to add
      const target = control.dataset.variantTarget;
      if (target) {
        if (!isOn(control)) {
          notes.push([target, control.dataset.variantClass]);
        }
      } else if (isOn(control)) {
        classes.push(control.dataset.variantClass);
      }
    });

    const lines = [];
    if (classes.length) {
      lines.push('html class="' + classes.join(' ') + '"');
    }
    lines.push(...notes.map(([target, name]) => `${target}: no ${name}`));
    if (pairs.length) {
      lines.push(
        ':root {',
        ...pairs.map(([prop, value]) => `  ${prop}: ${value};`),
        '}'
      );
    }

    // Never while it is being typed in - the box is an input as well as a
    // readout, and rewriting it under the cursor would eat the paste
    if (document.activeElement !== setup) {
      setup.value = lines.length
        ? lines.join('\n')
        : 'Default setup - nothing to change.';
    }

    const query = setupQuery(
      classes,
      notes.map(([, name]) => name),
      pairs
    );
    shareUrl = location.origin + location.pathname + (query ? '#' + query : '');
    keep(query);
  };

  const optionClasses = (control) =>
    [...control.options].map((option) => option.value).filter(Boolean);

  const apply = (control) => {
    if (control.type === 'checkbox') {
      const target = control.dataset.variantTarget;
      const el = target ? document.querySelector(target) : root;
      el?.classList.toggle(control.dataset.variantClass, isOn(control));
    } else if (control.hasAttribute('data-variant-classes')) {
      root.classList.remove(...optionClasses(control));
      if (control.value) root.classList.add(control.value);
    } else if (control.value) {
      root.style.setProperty(control.dataset.variantProp, control.value);
    } else {
      root.style.removeProperty(control.dataset.variantProp);
    }
  };

  // The box read backwards: someone else's setup pasted in drives the
  // switches, which drive the page. Anything the text does not mention
  // falls back to the default, so an empty box is a reset.
  const load = (text) => {
    const named = new Set(
      (text.match(/class\s*=\s*"([^"]*)"/)?.[1] || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
    );
    // `.mw-header: no mw-header-reveal` - a class the markup ships and the
    // setup takes away, which is the deviation worth reading
    const dropped = new Set(
      [...text.matchAll(/:\s*no\s+([\w-]+)/g)].map((m) => m[1])
    );
    const props = new Map(
      [...text.matchAll(/(--[\w-]+)\s*:\s*([^;\n}]+)/g)].map((m) => [
        m[1],
        m[2].trim(),
      ])
    );

    window.mwPalette?.write({
      primary: props.get('--mw-primary-color') ?? null,
      secondary: props.get('--mw-secondary-color') ?? null,
      dark: props.get('--mw-dark-page-background') ?? null,
      light: props.get('--mw-light-page-background') ?? null,
    });

    controls.forEach((control) => {
      if (control.type === 'checkbox') {
        const name = control.dataset.variantClass;
        const on = control.dataset.variantTarget
          ? !dropped.has(name)
          : named.has(name);
        control.checked = control.hasAttribute('data-variant-invert')
          ? !on
          : on;
      } else if (control.hasAttribute('data-variant-classes')) {
        control.value =
          optionClasses(control).find((name) => named.has(name)) ?? '';
      } else {
        control.value = props.get(control.dataset.variantProp) ?? '';
      }
      apply(control);
    });
  };

  // Picking a palette repaints the page, and the box has to say so
  window.mwRefreshSetup = render;

  // render() keeps the typed setup for the tab and leaves the box alone
  setup.addEventListener('input', () =>
    inPlace(() => {
      load(setup.value);
      render();
    })
  );
  // Normalises what was pasted back into the shape render() writes
  setup.addEventListener('blur', render);

  // Type and spacing switches change the height of everything above the
  // preview as well, so the section slides out from under whoever is
  // watching it. Hold its top edge where it was and the change happens in
  // place.
  //
  // Only while the preview is on screen: correcting the scroll for someone
  // parked further up would move *them* instead. `instant` because the
  // smooth default would animate the correction as a scroll of its own.
  const previewSection = document.getElementById('preview');

  const inPlace = (change) => {
    const box = previewSection?.getBoundingClientRect();
    const watching = box && box.bottom > 0 && box.top < window.innerHeight;
    if (!watching) return change();

    const before = box.top;
    change();
    const shift = previewSection.getBoundingClientRect().top - before;
    if (shift) window.scrollBy({ top: shift, behavior: 'instant' });
  };

  controls.forEach((control) =>
    control.addEventListener('change', () =>
      inPlace(() => {
        apply(control);
        render();
      })
    )
  );

  // A link beats what the tab kept; a hash that is only an anchor reads as none
  const shared = readSetup(location.hash.slice(1)) ?? readSetup(kept());
  if (shared) {
    // Drives the switches, which drive the page - then render() normalises
    // the box and writes the link back in the order it prints
    load(shared);
    render();
  } else {
    // Without a link or a look kept in this tab the showcase opens in its
    // own. That has to be spelled out: Firefox restores form state across a
    // reload, so the switches would otherwise come back set the way the last
    // visit left them, and the page with them.
    //
    // The markup is the one source for that starting state - the written
    // defaults for a plain switch, and for a targeted one whether the
    // class it stands for is actually on the element it names. A header
    // shipped without mw-header-reveal keeps it off.
    controls.forEach((control) => {
      const target = control.dataset.variantTarget;
      const el = target && document.querySelector(target);

      if (el) {
        const present = el.classList.contains(control.dataset.variantClass);
        control.checked = control.hasAttribute('data-variant-invert')
          ? !present
          : present;
      } else if (control.type === 'checkbox') {
        control.checked = control.defaultChecked;
      } else {
        const preset = [...control.options].find((o) => o.defaultSelected);
        control.value = preset ? preset.value : '';
      }
    });

    controls.forEach(apply);
    render();
  }

  document
    .getElementById('variant-share')
    ?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      const label = document.getElementById('variant-share-label');
      try {
        await navigator.clipboard.writeText(shareUrl);
        label.textContent = 'Copied';
      } catch {
        // Denied permission or an insecure origin. The address bar is no
        // help here - it never carries the setup - so hand the link over
        // in the box instead, where it can be selected by hand.
        setup.value = shareUrl;
        setup.select();
        label.textContent = 'Copy from the box';
      }
      setTimeout(() => {
        label.textContent = 'Copy link';
      }, 1600);
    });
});
