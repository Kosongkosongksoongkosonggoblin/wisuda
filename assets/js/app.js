const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

const dataGraduates = {
  "undangan": {
    "full_name": "Rud Tuakia",
    "graduation_date": "2026-10-24T08:00:00+07:00",
    "whatsapp_number": "6285849379953",
    "venue_name": "Galunggung - Kediaman Tualeka",
    "venue_address": "Jl. Galunggung. Kota Ambon",
    "maps_url": "https://maps.app.goo.gl/NYxhNHMqGdxWh5RR8",
    "dress_code": "Formal modern · earth tone",
    "hero_kicker": "A new chapter begins · 2026",
    "hero_title_line1": "Made for",
    "hero_title_line2": "this",
    "hero_title_em": "moment.",
    "hero_lead": "Sebuah perjalanan, ribuan cerita, dan satu pencapaian yang layak dirayakan.",
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
  { "name": "Andi", "message": "Selamat wisuda! Semoga sukses selalu." },
  { "name": "Keluarga", "message": "Bangga sekali dengan pencapaianmu." }
];

(function init() {
  const grad = dataGraduates["undangan"];

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  // Isi Data Teks
  setText('heroKicker', grad.hero_kicker);
  setText('heroLead', grad.hero_lead);
  $('heroTitle').innerHTML = `${grad.hero_title_line1}<br>${grad.hero_title_line2} <em>${grad.hero_title_em}</em>`;

  // Isi Data Tanggal & Waktu
  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  setText('gradDay', dayNum);
  setText('gradMonth', monthYear);
  setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  
  // Ini yang mengisi tulisan "Memuat..." menjadi Waktu
  setText('cardTime', `${dayName.toLowerCase().replace(/^\w/, c => c.toUpperCase())}, ${date.getDate()} ${monthYear.toLowerCase()}\nMulai pukul ${timeStr} WIB`);

  // Isi Data Lokasi
  setText('cardVenue', grad.venue_name);
  setText('venueName', grad.venue_name);
  setText('venueAddress', grad.venue_address);
  $('mapsBtn').href = grad.maps_url;
  setText('cardDress', grad.dress_code);

  // Isi Timeline
  $('timeline').innerHTML = grad.schedules.map(s => `
    <div class="event"><time>${s.time}</time><div><b>${s.title}</b><p>${s.desc}</p></div></div>
  `).join('');

  // Isi Galeri
  $('galleryList').innerHTML = grad.galleries.map(g => `
    <figure class="card"><img src="${g.url}"><figcaption>${g.caption}</figcaption></figure>
  `).join('');

  // Isi Ucapan
  $('wishesList').innerHTML = dataWishes.map(w => `
    <article class="card"><p>"${w.message}"</p><p style="color:var(--gold)">— ${w.name}</p></article>
  `).join('');

  // --- LOGIKA NAVIGASI SLIDE ---
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

  // --- MUSIK ---
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

  async function startMusic() {
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

  document.addEventListener('click', startMusic, { once: true });
  document.addEventListener('touchstart', startMusic, { once: true });
})();
