const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

(async function init() {
  const parts = location.pathname.split('/').filter(Boolean);
  const slug = parts[parts.length - 1].replace('.html', '') || 'rud-tuakia';

  let graduates = {};
  try {
    const res = await fetch('./data/graduates.json', { cache: 'no-store' });
    graduates = await res.json();
  } catch (e) {
    console.error('Gagal load graduates.json', e);
  }

  const grad = graduates[slug];
  if (!grad) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:grid;place-items:center;text-align:center;
                  padding:20px;font-family:'DM Sans',sans-serif;color:#f8f5ee">
        <div>
          <h1 style="font-size:2rem;margin-bottom:12px">Undangan tidak ditemukan</h1>
          <p style="color:#aab2ca">Cek kembali link yang Anda terima.</p>
          <a href="./" style="color:#e8ca8b;display:inline-block;margin-top:18px">← Kembali</a>
        </div>
      </div>`;
    return;
  }

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  if (grad.hero_kicker) setText('heroKicker', grad.hero_kicker);
  if (grad.hero_lead) setText('heroLead', grad.hero_lead);
  if (grad.hero_title_line1) {
    const t = $('heroTitle');
    if (t) t.innerHTML =
      `${escapeHtml(grad.hero_title_line1)}<br>${escapeHtml(grad.hero_title_line2 || '')} <em>${escapeHtml(grad.hero_title_em || '')}</em>`;
  }
  setText('gradName', `${grad.full_name} · UNDANGAN WISUDA DIGITAL`);
  setText('footerName', grad.full_name);
  if (grad.quote) setText('detailDesc', grad.quote);

  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  setText('gradDay', dayNum);
  setText('gradMonth', monthYear);
  setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  setText('cardTime', `${dayName.toLowerCase().replace(/^\w/, c => c.toUpperCase())}, ${date.getDate()} ${monthYear.toLowerCase()}\nMulai pukul ${timeStr} WIB`);

  setText('cardVenue', `${grad.venue_name || '—'}\n${grad.university || ''}`);
  setText('venueName', grad.venue_name || 'Tempat perayaan');
  setText('venueAddress', grad.venue_address || '');
  setText('venueDesc', [grad.venue_name, grad.university].filter(Boolean).join(' · '));
  const mapsBtn = $('mapsBtn');
  if (mapsBtn) mapsBtn.href = grad.maps_url || '#';

  if (grad.dress_code) setText('cardDress', grad.dress_code);

  const timeline = $('timeline');
  if (timeline && grad.schedules) {
    timeline.innerHTML = grad.schedules.map(s => `
      <div class="event">
        <time>${escapeHtml(s.time)}</time>
        <div><b>${escapeHtml(s.title)}</b><p>${escapeHtml(s.desc || '')}</p></div>
      </div>
    `).join('');
  }

  const galleryList = $('galleryList');
  if (galleryList && grad.galleries) {
    galleryList.innerHTML = grad.galleries.map(g => `
      <figure class="card">
        <img src="${escapeHtml(g.url)}" alt="${escapeHtml(g.caption || '')}" loading="lazy">
        <figcaption>${escapeHtml(g.caption || '')}</figcaption>
      </figure>
    `).join('');
  }

  try {
    const res = await fetch('./data/wishes.json', { cache: 'no-store' });
    const wishes = await res.json();
    const list = $('wishesList');
    if (list) {
      list.innerHTML = wishes.map(w => `
        <article class="card">
          <div class="ico">❝</div>
          <p style="color:#f8f5ee;font-style:italic">${escapeHtml(w.message)}</p>
          <p style="margin-top:12px;color:#e8ca8b;font-weight:700">— ${escapeHtml(w.name)}</p>
        </article>
      `).join('') || '<p class="desc">Belum ada ucapan.</p>';
    }
  } catch (e) {
    console.warn('wishes.json belum ada');
  }

  const guestName = new URLSearchParams(location.search).get('to');
  if (guestName) {
    const wrap = $('greetWrap');
    if (wrap) {
      const badge = document.createElement('div');
      badge.className = 'greet-badge';
      badge.textContent = `Halo, ${guestName} ✦`;
      wrap.appendChild(badge);
    }
    const nama = $('nama');
    if (nama) nama.value = guestName;
  }

  startCountdown(grad.graduation_date);

  const form = $('rsvpForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = $('nama').value.trim();
      const hadir = $('hadir').value;
      const pesan = $('pesan').value.trim();
      if (!nama) return alert('Nama wajib diisi.');

      const msg = `Halo, saya ${nama}.\nKonfirmasi wisuda ${grad.full_name}: ${hadir}.`
                + (pesan ? `\n\nUcapan: ${pesan}` : '')
                + `\n\n— dikirim dari undangan digital`;

      const wa = (grad.whatsapp_number || '6281234567890').replace(/\D/g, '');
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  initMusic();
  initReveal();
  initTilt();
})();

function startCountdown(isoDate) {
  const target = new Date(isoDate).getTime();
  const el = $('countdown');
  if (!el) return;

  const boxes = ['Hari','Jam','Menit','Detik'].map(l =>
    `<div class="cd-box"><b>0</b><span>${l}</span></div>`
  ).join('');
  el.innerHTML = boxes;
  const nums = el.querySelectorAll('.cd-box b');

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      nums.forEach(n => n.textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    [d, h, m, s].forEach((v, i) => {
      nums[i].textContent = String(v).padStart(2, '0');
    });
  };
  tick();
  setInterval(tick, 1000);
}

function initReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function initTilt() {
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (innerWidth < 760) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-3px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

function initMusic() {
  let ac = null, gain = null, playing = false, loop = null, idx = 0;
  const notes = [261.63,329.63,392,493.88,392,329.63,293.66,349.23,440,523.25,440,349.23];

  const btn = $('musicBtn');
  const label = $('musicLabel');
  const startBtn = $('startMusic');

  function tone(f, t, d, vol, type = 'sine') {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(gain);
    o.start(t); o.stop(t + d + 0.03);
  }
  function tick() {
    if (!playing || !ac) return;
    const t = ac.currentTime;
    tone(notes[idx % notes.length], t, 1.5, 0.055);
    if (idx % 3 === 0) tone(notes[idx % notes.length] / 2, t, 0.9, 0.025, 'triangle');
    if (idx % 4 === 0) tone(notes[(idx + 4) % notes.length] * 2, t + 0.1, 1.1, 0.018);
    idx++;
  }
  async function start() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw Error('Audio tidak didukung');
      ac = ac || new AC();
      await ac.resume();
      if (playing) return;
      gain = ac.createGain();
      gain.gain.value = 0.65;
      gain.connect(ac.destination);
      playing = true;
      tick();
      loop = setInterval(tick, 850);
      updateLabel();
    } catch (e) {
      if (label) label.textContent = 'Ketuk untuk musik';
    }
  }
  function stop() {
    playing = false;
    if (loop) clearInterval(loop);
    loop = null;
    if (gain && ac) gain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.08);
    updateLabel();
  }
  function updateLabel() {
    if (label) label.textContent = playing ? 'Musik: aktif ♫' : 'Musik: putar ♫';
    if (btn) btn.classList.toggle('on', playing);
    if (startBtn) startBtn.textContent = playing ? '♫ Musik sedang diputar' : '♫ Aktifkan musik';
  }
  function toggle() { playing ? stop() : start(); }

  btn && btn.addEventListener('click', toggle);
  startBtn && startBtn.addEventListener('click', toggle);
}
