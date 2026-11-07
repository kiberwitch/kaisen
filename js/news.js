(function () {
  'use strict';

  var list = document.querySelector('[data-news-list]');
  if (!list) return;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-news-tab]'));
  var search = document.querySelector('[data-news-search]');
  var featured = document.querySelector('[data-news-featured]');
  var pager = document.querySelector('[data-news-pager]');
  var empty = document.querySelector('[data-news-empty]');
  var cards = Array.prototype.slice.call(list.querySelectorAll('[data-news-item]'));
  var perPage = parseInt(list.getAttribute('data-per-page'), 10) || 3;

  var state = { category: 'all', query: '', page: 1 };

  function matches(el) {
    var category = el.getAttribute('data-category');
    var okCategory = state.category === 'all' || category === state.category;
    var okQuery = !state.query || el.textContent.toLowerCase().indexOf(state.query) !== -1;
    return okCategory && okQuery;
  }

  function renderPager(pages) {
    pager.innerHTML = '';
    pager.hidden = pages <= 1;
    if (pages <= 1) return;

    function button(label, page, extraClass, aria) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pager__link' + (extraClass ? ' ' + extraClass : '');
      b.textContent = label;
      if (aria) b.setAttribute('aria-label', aria);
      b.addEventListener('click', function () {
        state.page = page;
        render();
      });
      return b;
    }

    for (var i = 1; i <= pages; i++) {
      var current = i === state.page;
      var b = button(String(i), i, current ? 'pager__link--active' : '', 'Страница ' + i);
      if (current) b.setAttribute('aria-current', 'page');
      pager.appendChild(b);
    }
    if (state.page < pages) pager.appendChild(button('→', state.page + 1, '', 'Далее'));
  }

  function render() {
    var featuredVisible = featured ? matches(featured) : false;
    if (featured) featured.hidden = !featuredVisible;

    var found = cards.filter(matches);
    var pages = Math.max(1, Math.ceil(found.length / perPage));
    if (state.page > pages) state.page = pages;

    var from = (state.page - 1) * perPage;
    var visible = found.slice(from, from + perPage);
    cards.forEach(function (card) {
      card.hidden = visible.indexOf(card) === -1;
    });

    renderPager(pages);
    empty.hidden = featuredVisible || found.length > 0;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      state.category = tab.getAttribute('data-news-tab');
      state.page = 1;
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('tabs__tab--active', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  search.addEventListener('input', function () {
    state.query = search.value.trim().toLowerCase();
    state.page = 1;
    render();
  });

  render();
})();
