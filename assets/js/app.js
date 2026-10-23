const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

// ============================================================
// 1. DATA WISUDAWAN
// ============================================================
const dataGraduates = {
  "undangan": {
    "slug": "undangan",
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
  { "name": "Andi", "message": "Selamat wisuda! Semoga sukses selalu di babak baru ini." },
  { "name": "Keluarga Besar", "message": "Bangga sekali dengan pencapaianmu. Doa kami menyertaimu." }
];

// ============================================================
// 2. LOGIKA UTAMA (RENDER DATA & SLIDE)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const grad = dataGraduates["undangan"];

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  // Isi Teks Hero
  if ($('heroKicker')) setText('heroKicker', grad.hero_kicker);
  if ($('heroLead')) setText('heroLead', grad.hero_lead);
  if ($('heroTitle')) $('heroTitle').innerHTML = `${grad.hero_title_line1}<br>${grad.hero_title_line2} <em>${grad.hero_title_em}</em>`;

  // --- FITUR NAMA TAMU OTOMATIS (?to=Nama) ---
  const guestName = new URLSearchParams(location.search).get('to');
  if (guestName) {
    const wrap = $('greetWrap');
    if (wrap) {
      const badge = document.createElement('div');
      badge.className = 'greet-badge';
      // Style inline agar pasti muncul meski CSS terpisah
      badge.style.cssText = "display:inline-block; padding:8px 18px; margin-bottom:10px; border:1px solid #8ba0ff55; border-radius:999px; background:#8ba0ff15; color:#b8c4ff; font-size:.78rem; letter-spacing:.15em; text-transform:uppercase; font-weight:700;";
      badge.textContent = `Halo, ${guestName} ✦`;
      wrap.appendChild(badge);
    }
    
    // Isi otomatis nama di form RSVP
    const namaInput = $('nama');
    if (namaInput) namaInput.value = guestName;
  }

  // Isi Tanggal & Waktu
  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  if ($('gradDay')) setText('gradDay', dayNum);
  if ($('gradMonth')) setText('gradMonth', monthYear);
  if ($('gradTime')) setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  
  // Isi Kotak Waktu
  if ($('cardTime')) setText('cardTime', `${dayName.toLowerCase().replace(/^\w/, c => c.toUpperCase())}, ${date.getDate()} ${monthYear.toLowerCase()}\nMulai pukul ${timeStr} WIB`);

  // Isi Lokasi & Dress Code
  if ($('cardVenue')) setText('cardVenue', grad.venue_name);
  if ($('venueName')) setText('venueName', grad.venue_name);
  if ($('venueAddress')) setText('venueAddress', grad.venue_address);
  if ($('mapsBtn')) $('mapsBtn').href = grad.maps_url;
  if ($('cardDress')) setText('cardDress', grad.dress_code);

  // Render Timeline
  if ($('timeline')) {
    $('timeline').innerHTML = grad.schedules.map(s => `
      <div class="event"><time>${s.time}</time><div><b>${s.title}</b><p>${s.desc}</p></div></div>
    `).join('');
  }

  // Render Galeri
  if ($('galleryList')) {
    $('galleryList').innerHTML = grad.galleries.map(g => `
      <figure class="card"><img src="${g.url}"><figcaption>${g.caption}</figcaption></figure>
    `).join('');
  }

  // Render Ucapan
  if ($('wishesList')) {
    $('wishesList').innerHTML = dataWishes.map(w => `
      <article class="card"><p>"${w.message}"</p><p style="color:var(--gold)">— ${w.name}</p></article>
    `).join('');
  }

  // Navigasi Slide
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

  // Form RSVP ke WhatsApp
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
});

// ============================================================
// 3. EFEK KURSOR 3D TILT (INTERAKTIF)
// ============================================================
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 760) return;

  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.boxShadow = `0 20px 40px rgba(232, 202, 139, 0.2)`;
      card.style.borderColor = `rgba(232, 202, 139, 0.5)`;
    } else {
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.boxShadow = `none`;
      card.style.borderColor = `rgba(255, 255, 255, 0.1)`;
    }
  });
});

// ============================================================
// 4. MUSIK (LINK DARI ANDA)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const audio = new Audio('https://dn711105.ca.archive.org/0/items/matthew-c-wright-504-dewdrops-with-ocean-waves/Dewdrops%20%28with%20Ocean%20Waves%29.mp3');
  audio.loop = true;
  audio.volume = 0.5; 

  const btn = document.getElementById('musicBtn');
  
  if (btn) {
    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          btn.classList.add('playing');
        }).catch((err) => {
          console.log('Gagal memutar musik:', err);
          alert('Browser memblokir musik. Silakan klik sekali lagi.');
        });
      } else {
        audio.pause();
        btn.classList.remove('playing');
      }
    });
  }

  // Coba autoplay saat tamu pertama kali menyentuh layar
  document.addEventListener('click', () => {
    if (audio.paused && btn && !btn.classList.contains('playing')) {
      audio.play().then(() => {
        btn.classList.add('playing');
      }).catch(() => {});
    }
  }, { once: true });
});
