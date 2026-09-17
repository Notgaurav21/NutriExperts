/*
  This function shows a clean placeholder box whenever a real image file
  hasn't been added yet (or the filename doesn't match). Once you add the
  real image to the "images" folder with the exact filename referenced in
  the HTML (see the comments above each <img> tag), it will display
  automatically and this placeholder will no longer appear.
*/
function imgFallback(img) {
  const label = img.getAttribute('data-label') || 'Add image';
  const icon = img.getAttribute('data-icon') || '\uD83D\uDDBC\uFE0F';
  const sub = img.getAttribute('data-sub') || '';
  const size = img.getAttribute('data-size') || '';
  const box = document.createElement('div');
  box.className = 'placeholder-box' + (size ? ' ph-' + size : '');
  box.innerHTML =
    '<span class="ph-icon">' + icon + '</span>' +
    '<span class="ph-label">' + label + '</span>' +
    (sub ? '<span class="ph-sub">' + sub + '</span>' : '');
  img.replaceWith(box);
}

/*
  Basic site animations: a scroll-triggered fade-up (applied to elements
  with class "reveal") and a number count-up (applied to elements with
  a "data-count-to" attribute). Both are skipped entirely for visitors
  who have "reduce motion" turned on at the OS level — their content
  just appears normally, no animation logic runs.
*/
document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Number count-up
  const countEls = document.querySelectorAll('[data-count-to]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(el => countObserver.observe(el));
  }
});

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-count-to'));
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 900;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    const current = target * eased;
    el.textContent = decimals > 0
      ? current.toFixed(decimals) + suffix
      : Math.round(current).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
