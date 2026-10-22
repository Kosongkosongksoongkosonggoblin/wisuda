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
    stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.6 + 0.15,
      v: Math.random() * 0.25 + 0.05,
    }));
  }

  function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    for (const s of stars) {
      cx.beginPath();
      cx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
      cx.fillStyle = `rgba(232,202,139,${s.a})`;
      cx.fill();
      s.y += s.v * devicePixelRatio;
      if (s.y > cv.height) { s.y = 0; s.x = Math.random() * cv.width; }
    }
    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  draw();
})();
