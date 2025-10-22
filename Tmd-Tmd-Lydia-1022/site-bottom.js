(async () => {
  try {
    const res = await fetch('site-bottom.html', { cache: 'no-store' });
    const html = await res.text();
    const mount = document.getElementById('site-bottom-mount') || document.body;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    while (tmp.firstElementChild) {
      mount.appendChild(tmp.firstElementChild);
    }
  } catch (e) {
    console.warn('site-bottom load failed', e);
  }
})();
