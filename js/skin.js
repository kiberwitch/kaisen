(function () {
  'use strict';

  var dialog = document.getElementById('modal-skin');
  if (!dialog) return;

  var zone = dialog.querySelector('[data-skin-zone]');
  var input = dialog.querySelector('[data-skin-input]');
  var pick = dialog.querySelector('[data-skin-pick]');
  var fileName = dialog.querySelector('[data-skin-file]');
  var error = dialog.querySelector('[data-skin-error]');
  var saveButton = dialog.querySelector('[data-skin-save]');
  var models = Array.prototype.slice.call(dialog.querySelectorAll('[data-skin-model]'));
  var radios = Array.prototype.slice.call(document.querySelectorAll('[data-model-radio]'));

  var chosenFile = null;
  var objectUrl = null;

  function setModel(value) {
    models.forEach(function (button) {
      var on = button.getAttribute('data-skin-model') === value;
      button.classList.toggle('btn--active', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function currentModel() {
    var active = models.filter(function (b) {
      return b.getAttribute('aria-pressed') === 'true';
    })[0];
    return active ? active.getAttribute('data-skin-model') : 'steve';
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = !message;
  }

  function takeFile(file) {
    if (!file) return;
    if (file.type !== 'image/png') {
      chosenFile = null;
      fileName.hidden = true;
      saveButton.disabled = true;
      showError('Нужен файл в формате PNG.');
      return;
    }
    showError('');
    chosenFile = file;
    fileName.textContent = file.name;
    fileName.hidden = false;
    saveButton.disabled = false;
  }

  function save() {
    if (!chosenFile) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(chosenFile);

    var model = currentModel();
    radios.forEach(function (radio) {
      radio.checked = radio.value === model;
    });

    if (window.KaisenPreview) window.KaisenPreview.setCustom(objectUrl, model);

    dialog.close();
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-modal-open="modal-skin"]')) return;
    var checked = radios.filter(function (r) { return r.checked; })[0];
    setModel(checked ? checked.value : 'steve');
  });

  pick.addEventListener('click', function () { input.click(); });
  input.addEventListener('change', function () { takeFile(input.files[0]); });

  models.forEach(function (button) {
    button.addEventListener('click', function () {
      setModel(button.getAttribute('data-skin-model'));
    });
  });

  ['dragenter', 'dragover'].forEach(function (type) {
    zone.addEventListener(type, function (event) {
      event.preventDefault();
      zone.classList.add('dropzone--over');
    });
  });

  ['dragleave', 'drop'].forEach(function (type) {
    zone.addEventListener(type, function (event) {
      event.preventDefault();
      zone.classList.remove('dropzone--over');
    });
  });

  zone.addEventListener('drop', function (event) {
    takeFile(event.dataTransfer.files[0]);
  });

  saveButton.addEventListener('click', save);

  dialog.addEventListener('close', function () {
    input.value = '';
    chosenFile = null;
    fileName.hidden = true;
    saveButton.disabled = true;
    showError('');
  });
})();
