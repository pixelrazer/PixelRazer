/* PIXELRAZER — shared behaviour for write-up / listing / red-team pages.
   The landing page (index.html) runs its own DC runtime and does not use this. */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initScrollReveal();
  initReadingProgress();
  initBackToTop();
  initCodeCopy();
});

/* ── Mobile nav ──
   The sub-page <nav> ships without a hamburger; inject the toggle + label so
   the CSS drawer rules (.nav-toggle-input:checked + label + div) kick in. */
function initMobileNav() {
  var nav = document.querySelector('nav');
  if (!nav || nav.querySelector('.nav-toggle-input')) return;

  var linksDiv = nav.querySelector('div');
  if (!linksDiv) return;

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'nav-toggle-sub';
  checkbox.className = 'nav-toggle-input';

  var label = document.createElement('label');
  label.htmlFor = 'nav-toggle-sub';
  label.className = 'nav-toggle-label';
  label.setAttribute('aria-label', 'Toggle navigation');
  label.innerHTML = '<span></span><span></span><span></span>';

  nav.insertBefore(checkbox, linksDiv);
  nav.insertBefore(label, linksDiv);

  linksDiv.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { checkbox.checked = false; });
  });
}

/* ── Scroll reveal ──
   Opt-in and JS-safe: we only add the hidden state from script, so if JS never
   runs (or IntersectionObserver / reduced-motion), everything stays visible. */
function initScrollReveal() {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.contents .snippet, .contents figure, .contents img, [data-reveal]');
  if (!targets.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('reveal-in'); });
    return;
  }

  targets.forEach(function (el) { el.classList.add('reveal-init'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { io.observe(el); });

  // Safety net: never leave content hidden if something stalls.
  setTimeout(function () {
    targets.forEach(function (el) { el.classList.add('reveal-in'); });
  }, 2600);
}

/* ── Reading progress bar (write-up pages only) ── */
function initReadingProgress() {
  if (!document.querySelector('.contents')) return;

  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.appendChild(bar);

  function update() {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ── Back-to-top button ── */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&uarr;';
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function toggle() {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/* ── Copy buttons on code blocks ── */
function initCodeCopy() {
  if (!navigator.clipboard) return;

  document.querySelectorAll('.snippet').forEach(function (snippet) {
    var code = snippet.querySelector('.code-block');
    if (!code) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'copy';

    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1600);
      }).catch(function () {
        btn.textContent = 'error';
        setTimeout(function () { btn.textContent = 'copy'; }, 1600);
      });
    });

    snippet.appendChild(btn);
  });
}
