(function () {
  'use strict';

  var dialog = document.getElementById('modal-privilege');
  if (!dialog) return;

  var tabs = Array.prototype.slice.call(dialog.querySelectorAll('[data-privilege-tab]'));
  var panel = dialog.querySelector('[data-privilege-panel]');
  var art = dialog.querySelector('[data-privilege-art]');
  var image = dialog.querySelector('[data-privilege-image]');
  var img = dialog.querySelector('[data-privilege-img]');

  var ARTS = { 1: 'assets/classes/class-0.png', 2: 'assets/classes/class-1.png', 3: 'assets/classes/class-2.png', 4: 'assets/classes/class-3.png', 5: 'assets/classes/class-4.png' };
  var title = dialog.querySelector('[data-privilege-title]');
  var index = dialog.querySelector('[data-privilege-index]');

  var TINTS = {
    1: 'rgba(139,111,111,.25)',
    2: 'rgba(230,57,70,.25)',
    3: 'rgba(134,122,97,.25)',
    4: 'rgba(139,111,111,.25)',
    5: 'rgba(230,57,70,.25)',
    6: 'rgba(134,122,97,.25)'
  };

  function select(n) {
    n = String(n);
    var active = null;

    tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-privilege-tab') === n;
      tab.classList.toggle('btn--active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) active = tab;
    });

    title.textContent = 'ПРИВИЛЕГИЯ 0' + n;
    index.textContent = '0' + n + ' / KAISEN';
    art.style.setProperty('--privilege-tint', TINTS[n]);
    image.setAttribute('data-label', 'PNG 245×332 · привилегия 0' + n);
    if (ARTS[n]) {
      img.src = ARTS[n];
      img.hidden = false;
      image.classList.add('placeholder--filled');
    } else {
      img.hidden = true;
      image.classList.remove('placeholder--filled');
    }
    if (active) panel.setAttribute('aria-labelledby', active.id);
  }

  document.addEventListener('click', function (event) {
    var card = event.target.closest('[data-privilege]');
    if (card) select(card.getAttribute('data-privilege'));

    var tab = event.target.closest('[data-privilege-tab]');
    if (tab) select(tab.getAttribute('data-privilege-tab'));
  });

  dialog.addEventListener('keydown', function (event) {
    var current = tabs.indexOf(document.activeElement);
    if (current === -1) return;

    var next = null;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === null) return;

    event.preventDefault();
    tabs[next].focus();
    select(tabs[next].getAttribute('data-privilege-tab'));
  });

  select(1);
})();
