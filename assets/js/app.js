const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

// ============================================================
// 1. DATA WISUDAWAN & PENGATURAN
// ============================================================
const dataGraduates = {
  "undangan": {
    "slug": "undangan",
    "full_name": "Rud Tuakia",
    "nickname": "Rud",
    "nim": "20200101",
    "major": "Teknik Informatika",
    "university": "Universitas Pattimura",
    "graduation_date": "2026-10-24T08:00:00+07:00",
    "quote": "Setiap langkah kecil membawa kami ke momen besar ini.",
    "whatsapp_number": "6285849379953", // Nomor WA tujuan RSVP
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

const dataWishes = [
  { "name": "Andi", "message": "Selamat wisuda! Semoga sukses selalu di babak baru ini." },
  { "name": "Keluarga Besar", "message": "Bangga sekali dengan pencapaianmu. Doa kami menyertaimu." },
  { "name": "Sahabat Kampus", "message": "Akhirnya! Perjuangan panjang terbayar. Selamat ya!" }
];

// ============================================================
// 2. LOGIKA UTAMA (RENDER DATA)
// ============================================================
function initApp() {
  // Ambil slug dari URL (misal: /u/undangan)
  const parts = location.pathname.split('/').filter(Boolean);
  let slug = parts[parts.length - 1].replace('.html', ''); 
  
  if (!slug || slug === 'u') { slug = 'undangan'; }

  const grad = dataGraduates[slug];
  
  if (!grad) {
    document.body.innerHTML = `<div style="display:grid;place-items:center;height:100vh;color:white;">Undangan tidak ditemukan.</div>`;
    return;
  }

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  // --- Isi Teks Hero ---
  setText('heroKicker', grad.hero_kicker);
  setText('heroLead', grad.hero_lead);
  if ($('heroTitle')) {
    $('heroTitle').innerHTML = `${grad.hero_title_line1}<br>${grad.hero_title_line2} <em>${grad.hero_title_em}</em>`;
  }

  // --- Hitung Tanggal & Waktu ---
  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  setText('gradDay', dayNum);
  setText('gradMonth', monthYear);
  setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  
  // Isi Kotak Waktu (Memperbaiki tulisan "Memuat...")
  setText('cardTime', `${dayName.toLowerCase().replace(/^\w/, c => c.toUpperCase())}, ${date.getDate()} ${monthYear.toLowerCase()}\nMulai pukul ${timeStr} WIB`);

  // --- Isi Lokasi ---
  setText('cardVenue', grad.venue_name);
  setText('venueName', grad.venue_name);
  setText('venueAddress', grad.venue_address);
  if ($('mapsBtn')) $('mapsBtn').href = grad.maps_url;
  
  setText('cardDress', grad.dress_code);

  // --- Render Timeline ---
  if ($('timeline')) {
    $('timeline').innerHTML = grad.schedules.map(s => `
      <div class="event">
        <time>${s.time}</time>
        <div><b>${s.title}</b><p>${s.desc}</p></div>
      </div>
    `).join('');
  }

  // --- Render Galeri ---
  if ($('galleryList')) {
    $('galleryList').innerHTML = grad.galleries.map(g => `
      <figure class="card">
        <img src="${g.url}" alt="${g.caption}" loading="lazy">
        <figcaption>${g.caption}</figcaption>
      </figure>
    `).join('');
  }

  // --- Render Ucapan ---
  if ($('wishesList')) {
    $('wishesList').innerHTML = dataWishes.map(w => `
      <article class="card">
        <div class="ico">❝</div>
        <p style="color:#f8f5ee;font-style:italic">"${w.message}"</p>
        <p style="margin-top:12px;color:#e8ca8b;font-weight:700">— ${w.name}</p>
      </article>
    `).join('');
  }

  // --- Render Nama Tamu (?to=Nama) ---
  const guestName = new URLSearchParams(location.search).get('to');
  if (guestName && $('greetWrap')) {
    const badge = document.createElement('div');
    badge.className = 'greet-badge';
    badge.style.cssText = "display:inline-block; padding:8px 18px; margin-bottom:10px; border:1px solid #8ba0ff55; border-radius:999px; background:#8ba0ff15; color:#b8c4ff; font-size:.78rem; letter-spacing:.15em;";
    badge.textContent = `Halo, ${guestName} ✦`;
    $('greetWrap').appendChild(badge);
    
    if ($('nama')) $('nama').value = guestName;
  }

  // --- Countdown Timer ---
  startCountdown(grad.graduation_date);

  // --- Form RSVP ke WhatsApp ---
  if ($('rsvpForm')) {
    $('rsvpForm').addEventListener('submit', (e) => {
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
}

// ============================================================
// 3. FUNGSI PENDUKUNG
// ============================================================
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

// ============================================================
// 4. MUSIK AUTOPLAY (SAAT DISENTUH)
// ============================================================
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
      gain.gain.value = 0.5;
      gain.connect(ac.destination);
      playing = true;
      tick();
      loop = setInterval(tick, 850);
    } catch (e) {
      console.log('Audio diblokir browser');
    }
  }

  // Nyalakan saat tamu menyentuh layar
  document.addEventListener('click', start, { once: true });
  document.addEventListener('touchstart', start, { once: true });
  document.addEventListener('scroll', start, { once: true });
}

// ============================================================
// 5. SLIDE NAVIGATION & EFEK KURSOR 3D
// ============================================================
function initSlidesAndEffects() {
  const slides = document.querySelectorAll('.slide');
  const btnNext = $('btnNext');
  const btnPrev = $('btnPrev');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) btnNext.disabled = index === slides.length - 1;
  }

  showSlide(0);

  if (btnNext) btnNext.addEventListener('click', () => { if (currentSlide < slides.length - 1) showSlide(++currentSlide); });
  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentSlide > 0) showSlide(--currentSlide); });

  // Efek Kursor 3D Tilt
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8; 
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.transition = 'none';
      } else {
        card.style.transform = '';
        card.style.transition = 'transform 0.3s ease';
      }
    });
  });
}

// ============================================================
// 6. JALANKAN SEMUA SAAT HALAMAN DIMUAT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initMusic();
  initSlidesAndEffects();
});
