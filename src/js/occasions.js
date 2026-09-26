// Picks today's occasion before the first paint. A classic script in <head>,
// so the decoration arrives with the page instead of shifting it a moment
// later; main.js then plays what this decided - the intro and the particles.
//
//   <html data-mw-occasions='[{"effect": "snow", "from": "2026-12-05",
//     "until": "2027-02-05", "yearly": true, "scroll": true, "size": "sm"}]'>
//   <script src="maverick-wave/src/js/occasions.js"></script>
(function () {
  'use strict';

  const EFFECTS = [
    'snow',
    'christmas',
    'newyear',
    'spring',
    'easter',
    'summer',
    'autumn',
    'football',
    'birthday',
    'anniversary',
  ];

  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  // ?mw-occasion=snow&mw-occasion-size=lg&mw-occasion-scroll&mw-occasion-intro
  // shows an occasion on the live page before anyone books it
  const preview = params.get('mw-occasion');
  let entry = null;

  if (preview !== null) {
    entry = {
      effect: preview,
      size: params.get('mw-occasion-size'),
      scroll: params.has('mw-occasion-scroll'),
      intro: params.has('mw-occasion-intro') && 'preview',
    };
  } else if (html.dataset.mwOccasions) {
    try {
      entry = activeOccasion(JSON.parse(html.dataset.mwOccasions), new Date());
    } catch (error) {
      console.warn('MaverickWave: data-mw-occasions is not valid JSON', error);
    }
  }

  if (!entry || !EFFECTS.includes(entry.effect)) return;

  EFFECTS.forEach((name) => html.classList.remove('mw-occasion-' + name));
  html.classList.add('mw-occasion-' + entry.effect);
  html.classList.toggle('mw-occasion-scroll', !!entry.scroll);
  html.classList.toggle('mw-occasion-sm', entry.size === 'sm');
  html.classList.toggle('mw-occasion-lg', entry.size === 'lg');
  // 'preview' plays on every load, an empty value once per visit
  if (entry.intro) {
    html.setAttribute(
      'data-mw-occasion-intro',
      entry.intro === 'preview' ? 'preview' : ''
    );
  }

  // The shortest window that contains today wins, so Christmas beats the snow
  // season around it without anyone having to order the list
  function activeOccasion(entries, now) {
    let best = null;

    (Array.isArray(entries) ? entries : []).forEach((candidate) => {
      // An effect this version does not draw must not win the day for nothing
      if (!EFFECTS.includes(candidate.effect)) return;
      const span = occasionWindow(candidate, now);
      if (span && (!best || span.end - span.start < best.length)) {
        best = { entry: candidate, length: span.end - span.start };
      }
    });

    return best && best.entry;
  }

  // Local days, the last one included. A yearly window keeps month and day and
  // may run over New Year - 5 December to 5 February.
  function occasionWindow(candidate, now) {
    const from = localDay(candidate.from);
    const until = localDay(candidate.until);
    if (!from || !until || until < from) return null;

    const years = candidate.yearly
      ? [now.getFullYear() - 1, now.getFullYear()]
      : [from.getFullYear()];

    for (const year of years) {
      const shift = year - from.getFullYear();
      const start = new Date(year, from.getMonth(), from.getDate());
      const end = new Date(
        until.getFullYear() + shift,
        until.getMonth(),
        until.getDate() + 1
      );
      if (start <= now && now < end) return { start, end };
    }

    return null;
  }

  function localDay(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    return match ? new Date(+match[1], match[2] - 1, +match[3]) : null;
  }
})();
