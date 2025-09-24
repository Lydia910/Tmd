
(function () {
  var DEFAULT_BASE = 'https://617654bb26fa.ngrok-free.app/plugin';
  if (!localStorage.getItem('tmd_plugin_base')) {
    localStorage.setItem('tmd_plugin_base', DEFAULT_BASE);
  }
})();
