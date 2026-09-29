(() => {
  const stage = document.getElementById('stage');
  const inv = document.getElementById('inv');
  const fx = document.getElementById('fx');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = ['#1e4b8a', '#2b5aa0', '#0a1f44', '#e63946', '#ff5a67', '#c1121f', '#ffffff', '#ffd700'];
  const r = (a, b) => Math.random() * (b - a) + a;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  let opened = false, timer = null;

  function confetti() {
    const c = document.createElement('div');
    const s = r(7, 13);
    c.className = 'cf';
    c.style.cssText = `left:${r(0, 100)}%;width:${s}px;height:${s * r(1, 1.8)}px;background:${pick(cols)};` +
      `border-radius:${pick(['2px', '50%', '0'])};animation:fall ${r(2.5, 4.5)}s linear ${r(0, .6)}s forwards`;
    fx.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }

  function balloon() {
    const b = document.createElement('div');
    const k = r(.7, 1.2);
    b.className = 'bl-o';
    b.style.cssText = `left:${r(3, 88)}%;width:${44 * k}px;height:${54 * k}px;background:${pick(cols)};` +
      `--d:${r(-60, 60)}px;animation:rise ${r(4, 6.5)}s ease-in ${r(0, 1.2)}s forwards`;
    fx.appendChild(b);
    setTimeout(() => b.remove(), 8500);
  }

  function celebrate() {
    if (reduce) return;
    for (let i = 0; i < 40; i++) setTimeout(confetti, i * 25);
    for (let i = 0; i < 9; i++) setTimeout(balloon, i * 120);
    let t = 0;
    timer = setInterval(() => {
      t += 300; confetti();
      if (Math.random() > .55) balloon();
      if (t > 6000) { clearInterval(timer); timer = null; }
    }, 300);
  }

  function open() {
    if (opened) return;
    opened = true;
    stage.classList.add('open');
    setTimeout(() => inv.classList.add('show'), 500);
    setTimeout(celebrate, 700);
    playMusic();
  }

  function close() {
    if (!opened) return;
    opened = false;
    inv.classList.remove('show');
    fx.innerHTML = '';
    if (timer) { clearInterval(timer); timer = null; }
    setTimeout(() => stage.classList.remove('open'), 300);
  }

  ['cl', 'cr', 'openBtn'].forEach(id => document.getElementById(id).addEventListener('click', open));
  inv.addEventListener('click', e => {
    if (e.target.closest('.qr') || e.target.closest('a')) return;
    close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // ---- Música ----
  const bgm = document.getElementById('bgm');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  let musicOn = false;

  function playMusic() {
    if (musicOn) return;
    bgm.volume = 0.55;
    bgm.play().then(() => {
      musicOn = true;
      musicBtn.classList.add('playing');
      musicIcon.className = 'bi bi-pause-fill';
    }).catch(() => {});
  }
  function toggleMusic() {
    if (musicOn) {
      bgm.pause();
      musicOn = false;
      musicBtn.classList.remove('playing');
      musicIcon.className = 'bi bi-music-note-beamed';
    } else {
      playMusic();
    }
  }
  musicBtn.addEventListener('click', e => { e.stopPropagation(); toggleMusic(); });

  // ---- Cuenta regresiva ----
  const cd = document.getElementById('countdown');
  if (cd) {
    const target = new Date(cd.dataset.target).getTime();
    const elD = document.getElementById('cdD'), elH = document.getElementById('cdH'),
          elM = document.getElementById('cdM'), elS = document.getElementById('cdS'),
          label = cd.querySelector('.cd-label');
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        label.innerHTML = '<i class="bi bi-stars"></i> ¡Hoy es el gran día!';
        elD.textContent = elH.textContent = elM.textContent = elS.textContent = '00';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff % 86400000 / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      const s = Math.floor(diff % 60000 / 1000);
      elD.textContent = String(d).padStart(2, '0');
      elH.textContent = String(h).padStart(2, '0');
      elM.textContent = String(m).padStart(2, '0');
      elS.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }
})();
