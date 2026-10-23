const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// ============================================================
// DATA WISUDAWAN (DITANAM LANGSUNG DI SINI)
// ============================================================
const dataGraduates = {
  "undangan": {
    "slug": "undangan",
    "full_name": "Rud Tuakia",
    "nickname": "Rud",
    "nim": "20200101",
    "major": "Teknik Informatika",
    "faculty": "Fakultas Teknik",
    "university": "Universitas Pattimura",
    "graduation_date": "2026-10-24T08:00:00+07:00",
    "quote": "Setiap langkah kecil membawa kami ke momen besar ini.",
    "whatsapp_number": "6285849379953",
    "venue_name": "Galunggung - Kediaman Tualeka",
    "venue_address": "Jl. Galunggung. Kota Ambon",
    "maps_url": "https://maps.app.goo.gl/NYxhNHMqGdxWh5RR8",
    "dress_code": "Formal modern · earth tone",
    "hero_kicker": "A new chapter begins · 2026",
    "hero_title_line1": "Made for",
    "hero_title_line2": "this",
    "hero_title_em": "moment.",
    "hero_lead": "Sebuah perjalanan, ribuan cerita, dan satu pencapaian yang layak dirayakan. Dengan penuh syukur, kami mengundang Anda untuk menjadi bagian dari hari istimewa ini.",
    "schedules": [
      { "time": "07.00 WIB", "title": "Welcome & registration", "desc": "Penyambutan tamu dan registrasi" },
      { "time": "08.00 WIB", "title": "Opening ceremony", "desc": "Pembukaan dan doa bersama" },
      { "time": "09.00 WIB", "title": "Graduation moment", "desc": "Prosesi wisuda dan sesi penghargaan" },
      { "time": "11.00 WIB", "title": "Memories together", "desc": "Foto bersama dan ramah tamah" }
    ],
    "galleries": [
      { "url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop", "caption": "Awal perjalanan" },
      { "url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop", "caption": "Bersama teman" },
      { "url": "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=800&auto=format&fit=crop", "caption": "Hari kelulusan" }
    ]
  }
};

// ============================================================
// DATA UCAPAN (DITANAM LANGSUNG)
// ============================================================
const dataWishes = [
  { "name": "Andi", "message": "Selamat wisuda! Semoga sukses selalu di babak baru ini." },
  { "name": "Keluarga Besar", "message": "Bangga sekali dengan pencapaianmu. Doa kami menyertaimu." },
  { "name": "Sahabat Kampus", "message": "Akhirnya! Perjuangan panjang terbayar. Selamat ya!" }
];

// ============================================================
// LOGIKA UTAMA
// ============================================================
(function init() {
  const parts = location.pathname.split('/').filter(Boolean);
  let slug = parts[parts.length - 1].replace('.html', ''); 
  
  if (!slug || slug === 'u') {
    slug = 'undangan'; 
  }

  const grad = dataGraduates[slug];
  
  if (!grad) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:grid;place-items:center;text-align:center;
                  padding:20px;font-family:'DM Sans',sans-serif;color:#f8f5ee">
        <div>
          <h1 style="font-size:2rem;margin-bottom:12px">Undangan tidak ditemukan</h1>
          <p style="color:#aab2ca">Data untuk "${slug}" tidak ditemukan.</p>
          <a href="/" style="color:#e8ca8b;display:inline-block;margin-top:18px">← Kembali</a>
        </div>
      </div>`;
    return;
  }

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  // Render Teks Hero
  if (grad.hero_kicker) setText('heroKicker', grad.hero_kicker);
  if (grad.hero_lead) setText('heroLead', grad.hero_lead);
  if (grad.hero_title_line1) {
    const t = $('heroTitle');
    if (t) t.innerHTML =
      `${escapeHtml(grad.hero_title_line1)}<br>${escapeHtml(grad.hero_title_line2 || '')} <em>${escapeHtml(grad.hero_title_em || '')}</em>`;
  }
  if (grad.quote) setText('detailDesc', grad.quote);

  // Render Tanggal
  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  setText('gradDay', dayNum);
  setText('gradMonth', monthYear);
  setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  setText('cardTime', `${dayName.toLowerCase().replace(/^\w/, c => c.toUpperCase())}, ${date.getDate()} ${monthYear.toLowerCase()}\nMulai pukul ${timeStr} WIB`);

  // Render Lokasi
  setText('cardVenue', `${grad.venue_name || '—'}`);
  setText('venueName', grad.venue_name || 'Tempat perayaan');
  setText('venueAddress', grad.venue_address || '');
  const mapsBtn = $('mapsBtn');
  if (mapsBtn) mapsBtn.href = grad.maps_url || '#';

  if (grad.dress_code) setText('cardDress', grad.dress_code);

  // Render Timeline
  const timeline = $('timeline');
  if (timeline && grad.schedules) {
    timeline.innerHTML = grad.schedules.map(s => `
      <div class="event">
        <time>${escapeHtml(s.time)}</time>
        <div><b>${escapeHtml(s.title)}</b><p>${escapeHtml(s.desc || '')}</p></div>
      </div>
    `).join('');
  }

  // Render Galeri
  const galleryList = $('galleryList');
  if (galleryList && grad.galleries) {
    galleryList.innerHTML = grad.galleries.map(g => `
      <figure class="card">
        <img src="${escapeHtml(g.url)}" alt="${escapeHtml(g.caption || '')}" loading="lazy">
        <figcaption>${escapeHtml(g.caption || '')}</figcaption>
      </figure>
    `).join('');
  }

  // Render Ucapan
  const list = $('wishesList');
  if (list) {
    list.innerHTML = dataWishes.map(w => `
      <article class="card">
        <div class="ico">❝</div>
        <p style="color:#f8f5ee;font-style:italic">${escapeHtml(w.message)}</p>
        <p style="margin-top:12px;color:#e8ca8b;font-weight:700">— ${escapeHtml(w.name)}</p>
      </article>
    `).join('') || '<p class="desc">Belum ada ucapan.</p>';
  }

  // Render Nama Tamu
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

  // Form RSVP
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
  initTilt();
})();

// ============ FUNGSI PENDUKUNG ============
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
      if (!AC) return;
      ac = ac || new AC();
      await ac.resume();
      if (playing) return;
      gain = ac.createGain();
      gain.gain.value = 0.65;
      gain.connect(ac.destination);
      playing = true;
      tick();
      loop = setInterval(tick, 850);
    } catch (e) {
      console.log('Audio diblokir');
    }
  }

  document.addEventListener('click', start, { once: true });
  document.addEventListener('touchstart', start, { once: true });
}

// ==========================================
// LOGIKA NAVIGASI SLIDE (BEBAS BLUR)
// ==========================================
(function initSlides() {
  const slides = document.querySelectorAll('.slide');
  const btnNext = $('btnNext');
  const btnPrev = $('btnPrev');
  let currentSlide = 0;

  function showSlide(index) {
    // Sembunyikan semua slide
    slides.forEach(s => s.classList.remove('active'));
    
    // Tampilkan slide saat ini
    slides[index].classList.add('active');
    
    // Ambil semua elemen .reveal di slide ini
    const reveals = slides[index].querySelectorAll('.reveal');
    
    // Hapus class 'visible' agar animasi ter-reset
    reveals.forEach(el => el.classList.remove('visible'));

    // Pancing class 'visible' agar animasi CSS (fade-up) berjalan
    setTimeout(() => {
      reveals.forEach((el, i) => {
        // Efek Stagger: beri jeda antar elemen agar muncul bergantian
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 100);
      });
    }, 50);

    // Atur status tombol panah
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) btnNext.disabled = index === slides.length - 1;
  }

  // Tampilkan Slide Pertama
  showSlide(0);

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    });

    btnPrev.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });

    // Kontrol via keyboard
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') btnNext.click();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') btnPrev.click();
    });
  }
})();
