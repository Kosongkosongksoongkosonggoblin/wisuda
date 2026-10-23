// ==========================================
// EFEK BINTANG JATUH & BERKELIP (PARTICLE)
// ==========================================
(function () {
  const cv = document.getElementById('stars');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let stars = [];

  function resize() {
    cv.width = innerWidth * devicePixelRatio;
    cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    
    // Jumlah bintang (100 - 150 sudah sangat pas)
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.5 + 0.5,     // Ukuran bintang
      a: Math.random() * 0.6 + 0.2,     // Opasitas (transparansi)
      v: Math.random() * 0.3 + 0.1,     // Kecepatan jatuh
      dx: Math.random() * 0.2 - 0.1,    // Geser sedikit ke samping
      twinkle: Math.random() * 0.02     // Kecepatan berkelip
    }));
  }

  function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    
    for (const s of stars) {
      cx.beginPath();
      cx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
      // Warna Emas Lembut
      cx.fillStyle = `rgba(232, 202, 139, ${s.a})`;
      cx.fill();
      
      // Gerakan
      s.y += s.v * devicePixelRatio;
      s.x += s.dx * devicePixelRatio;
      
      // Efek Berkelip (Twinkle)
      s.a += s.twinkle;
      if (s.a > 0.8 || s.a < 0.1) s.twinkle *= -1;

      // Jika bintang keluar layar bawah, reset ke atas
      if (s.y > cv.height) { 
        s.y = 0; 
        s.x = Math.random() * cv.width; 
      }
    }
    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  draw();
})();
