const $ = (id) => document.getElementById(id);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

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

document.addEventListener('DOMContentLoaded', () => {
  const grad = dataGraduates["undangan"];

  document.title = `Undangan Wisuda — ${grad.full_name}`;

  // Isi Teks Hero
  if ($('heroKicker')) setText('heroKicker', grad.hero_kicker);
  if ($('heroLead')) setText('heroLead', grad.hero_lead);
  if ($('heroTitle')) $('heroTitle').innerHTML = `${grad.hero_title_line1}<br>${grad.hero_title_line2} <em>${grad.hero_title_em}</em>`;

  // Isi Tanggal & Waktu
  const date = new Date(grad.graduation_date);
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
  const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  if ($('gradDay')) setText('gradDay', dayNum);
  if ($('gradMonth')) setText('gradMonth', monthYear);
  if ($('gradTime')) setText('gradTime', `${dayName} · ${timeStr} WIB – SELESAI`);
  
  // --- INI YANG MENGISI "MEMUAT..." MENJADI WAKTU ---
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
});

// ==========================================
// EFEK KURSOR 3D TILT (INTERAKTIF)
// ==========================================
document.addEventListener('mousemove', (e) => {
  // Hanya jalan di layar laptop/PC (bukan HP)
  if (window.innerWidth < 760) return;

  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Jika kursor berada di atas kartu
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Hitung derajat kemiringan
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.boxShadow = `0 20px 40px rgba(232, 202, 139, 0.2)`;
      card.style.borderColor = `rgba(232, 202, 139, 0.5)`;
    } else {
      // Kembalikan ke posisi semula
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.boxShadow = `none`;
      card.style.borderColor = `rgba(255, 255, 255, 0.1)`;
    }
  });
});
