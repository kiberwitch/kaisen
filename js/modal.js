(function () {
  'use strict';

  var root = document.documentElement;

  function syncScrollLock() {
    root.classList.toggle('scroll-lock', document.querySelectorAll('dialog[open]').length > 0);
  }

  function openDialog(id) {
    var dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return;
    dialog.showModal();
    syncScrollLock();
  }

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function clickedBackdrop(dialog, event) {
    var rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-modal-open]');
    if (opener) {
      openDialog(opener.getAttribute('data-modal-open'));
      return;
    }

    var closer = event.target.closest('[data-modal-close]');
    if (closer) {
      closeDialog(closer.closest('dialog'));
      return;
    }

    if (event.target.tagName === 'DIALOG' && clickedBackdrop(event.target, event)) {
      closeDialog(event.target);
    }
  });

  document.addEventListener(
    'close',
    function (event) {
      syncScrollLock();

      var dialog = event.target;
      var hash = location.hash.slice(1);
      if (dialog.id && hash && dialog.id === 'modal-' + hash) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    },
    true
  );

  function openFromHash() {
    var hash = location.hash.slice(1);
    if (hash) openDialog('modal-' + hash);
  }

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
