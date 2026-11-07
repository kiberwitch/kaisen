(function () {
  'use strict';

  var stage = document.querySelector('[data-skin-stage]');
  if (!stage) return;

  var canvas = stage.querySelector('[data-skin-canvas]');
  var status = stage.querySelector('[data-skin-status]');
  var radios = Array.prototype.slice.call(document.querySelectorAll('[data-model-radio]'));
  var config = window.KAISEN_CONFIG || { skins: [] };

  var viewer = null;
  var presets = config.skins || [];
  var customUrl = null;
  var currentId = 'steve';

  function showStatus(message) {
    status.textContent = message || '';
    status.hidden = !message;
  }

  function modelOf(id) {
    var preset = presets.filter(function (s) { return s.id === id; })[0];
    if (preset) return preset.model;
    return id === 'alex' ? 'slim' : 'default';
  }

  function render() {
    if (!viewer) return;
    var preset = presets.filter(function (s) { return s.id === currentId; })[0];
    var url = customUrl || (preset && preset.url);
    if (!url) {
      showStatus('Скин не найден');
      return;
    }
    viewer.loadSkin(url, { model: modelOf(currentId) }).then(
      function () { showStatus(''); },
      function () {
        showStatus('Не удалось загрузить скин. Если сайт открыт как файл, запусти его через сервер: npm start.');
      }
    );
  }

  function init() {
    if (!window.skinview3d || !window.WebGLRenderingContext) {
      showStatus('3D-предпросмотр недоступен в этом браузере');
      return;
    }

    var box = stage.getBoundingClientRect();
    try {
      viewer = new window.skinview3d.SkinViewer({
        canvas: canvas,
        width: Math.max(1, Math.round(box.width)),
        height: Math.max(1, Math.round(box.height)),
        zoom: 0.8
      });
    } catch (e) {
      showStatus('3D-предпросмотр недоступен: не удалось запустить WebGL');
      return;
    }

    viewer.animation = new window.skinview3d.IdleAnimation();
    viewer.autoRotate = true;
    viewer.autoRotateSpeed = 0.6;
    viewer.controls.enableZoom = false;
    viewer.controls.enablePan = false;

    canvas.addEventListener('pointerdown', function () { viewer.autoRotate = false; });

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(function (entries) {
        var r = entries[0].contentRect;
        if (r.width > 0 && r.height > 0) viewer.setSize(Math.round(r.width), Math.round(r.height));
      }).observe(stage);
    }

    var checked = radios.filter(function (r) { return r.checked; })[0];
    currentId = checked ? checked.value : currentId;
    showStatus('Загрузка модели…');

    render();
  }

  radios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      currentId = radio.value;
      render();
    });
  });

  window.KaisenPreview = {
    setCustom: function (url, modelId) {
      customUrl = url;
      currentId = modelId || currentId;
      render();
    }
  };

  init();
})();
