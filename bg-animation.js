/* =============================================
   DYNAMIC BACKGROUND — Dreamy Floating World
   Soft gradient blobs, translucent shapes & particles
   ============================================= */

(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, animId;
  let mouse = { x: -1000, y: -1000 };
  let time = 0;

  // --- Resize ---
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // --- Mouse ---
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // ===============================
  // FLOATING GRADIENT BLOBS
  // ===============================
  const blobs = [];
  const blobColors = [
    { r: 242, g: 128, b: 118, a: 0.10 },  // coral #F28076
    { r: 255, g: 182, b: 175, a: 0.09 },  // rose #FFB6AF
    { r: 250, g: 224, b: 199, a: 0.10 },  // cream #FAE0C7
    { r: 251, g: 193, b: 147, a: 0.09 },  // peach #FBC193
    { r: 78, g: 176, b: 155, a: 0.08 },   // teal #4EB09B
    { r: 242, g: 160, b: 150, a: 0.08 },  // light coral
  ];

  function initBlobs() {
    blobs.length = 0;
    for (let i = 0; i < 6; i++) {
      const c = blobColors[i % blobColors.length];
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 200 + 150,
        color: c,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.005 + 0.003,
        wobbleX: Math.random() * 0.8 + 0.3,
        wobbleY: Math.random() * 0.8 + 0.3,
      });
    }
  }

  function drawBlobs() {
    blobs.forEach(b => {
      b.phase += b.phaseSpeed;
      b.x += b.vx + Math.sin(b.phase * b.wobbleX) * 0.5;
      b.y += b.vy + Math.cos(b.phase * b.wobbleY) * 0.4;

      // Bounce off edges softly
      if (b.x < -b.radius) b.x = width + b.radius;
      if (b.x > width + b.radius) b.x = -b.radius;
      if (b.y < -b.radius) b.y = height + b.radius;
      if (b.y > height + b.radius) b.y = -b.radius;

      // Mouse repulsion
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const force = (300 - dist) / 300 * 0.8;
        b.x += dx / dist * force;
        b.y += dy / dist * force;
      }

      // Morphing radius
      const r = b.radius + Math.sin(b.phase) * 30;

      // Draw radial gradient blob
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      grad.addColorStop(0, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.color.a})`);
      grad.addColorStop(0.5, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.color.a * 0.5})`);
      grad.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  // ===============================
  // FLOATING TRANSLUCENT SHAPES
  // ===============================
  const shapes = [];
  const shapeTypes = ['circle', 'ring', 'diamond', 'hexagon', 'star'];

  function initShapes() {
    shapes.length = 0;
    const count = Math.max(12, Math.floor(width / 120));
    for (let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 25 + 10,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.2 + 0.05), // gentle upward drift
        alpha: Math.random() * 0.2 + 0.05,
        baseAlpha: Math.random() * 0.2 + 0.05,
        phase: Math.random() * Math.PI * 2,
        colorIdx: Math.floor(Math.random() * 3),
      });
    }
  }

  const shapeColors = [
    [242, 128, 118],  // coral
    [78, 176, 155],   // teal
    [251, 193, 147],  // peach
  ];

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.globalAlpha = s.alpha;

    const c = shapeColors[s.colorIdx];
    const color = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`;
    const fillColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.15)`;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.fillStyle = fillColor;

    switch (s.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'ring':
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.6, 0);
        ctx.lineTo(0, s.size);
        ctx.lineTo(-s.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const hx = Math.cos(angle) * s.size;
          const hy = Math.sin(angle) * s.size;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (Math.PI * 2 / 5) * i - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          ctx.lineTo(Math.cos(outerAngle) * s.size, Math.sin(outerAngle) * s.size);
          ctx.lineTo(Math.cos(innerAngle) * s.size * 0.4, Math.sin(innerAngle) * s.size * 0.4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  function updateShapes() {
    shapes.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotSpeed;
      s.phase += 0.015;
      s.alpha = s.baseAlpha + Math.sin(s.phase) * 0.08;

      // Wrap
      if (s.y < -s.size * 2) {
        s.y = height + s.size * 2;
        s.x = Math.random() * width;
      }
      if (s.x < -s.size * 2) s.x = width + s.size * 2;
      if (s.x > width + s.size * 2) s.x = -s.size * 2;

      drawShape(s);
    });
  }

  // ===============================
  // SPARKLE DUST PARTICLES
  // ===============================
  const dust = [];

  function initDust() {
    dust.length = 0;
    const count = Math.max(30, Math.floor(width / 40));
    for (let i = 0; i < count; i++) {
      dust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.005,
        drift: (Math.random() - 0.5) * 0.2,
        fall: Math.random() * 0.15 + 0.02,
      });
    }
  }

  function drawDust() {
    dust.forEach(d => {
      d.phase += d.speed;
      d.x += d.drift + Math.sin(d.phase * 3) * 0.3;
      d.y += d.fall;

      const twinkle = (Math.sin(d.phase * 5) + 1) * 0.5;
      const a = d.alpha * twinkle;

      // Wrap
      if (d.y > height + 5) {
        d.y = -5;
        d.x = Math.random() * width;
      }
      if (d.x < -5) d.x = width + 5;
      if (d.x > width + 5) d.x = -5;

      // Glow
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 170, 255, ${a * 0.15})`;
      ctx.fill();

      // Core sparkle
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 215, 255, ${a})`;
      ctx.fill();
    });
  }

  // ===============================
  // SOFT AURORA GRADIENT WAVES
  // ===============================
  function drawAurora() {
    const t = time * 0.002;

    // Top aurora
    const aGrad = ctx.createLinearGradient(0, 0, width, height * 0.4);
    const hue1 = 240 + Math.sin(t) * 20;
    const hue2 = 270 + Math.cos(t * 0.7) * 25;
    aGrad.addColorStop(0, `hsla(${hue1}, 60%, 80%, 0.06)`);
    aGrad.addColorStop(0.5, `hsla(${hue2}, 50%, 75%, 0.04)`);
    aGrad.addColorStop(1, `hsla(200, 60%, 85%, 0)`);
    ctx.fillStyle = aGrad;
    ctx.fillRect(0, 0, width, height * 0.5);

    // Bottom aurora
    const bGrad = ctx.createLinearGradient(0, height * 0.6, width, height);
    const hue3 = 200 + Math.sin(t * 0.5) * 30;
    bGrad.addColorStop(0, `hsla(${hue3}, 50%, 80%, 0)`);
    bGrad.addColorStop(0.5, `hsla(260, 40%, 80%, 0.04)`);
    bGrad.addColorStop(1, `hsla(220, 60%, 85%, 0.06)`);
    ctx.fillStyle = bGrad;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);

    // Flowing wave lines
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      const waveAlpha = 0.04 + w * 0.01;
      const waveHue = 230 + w * 30;

      for (let x = 0; x <= width; x += 3) {
        const nx = x / width;
        const y = height * (0.3 + w * 0.2)
          + Math.sin(nx * 4 + t * (1 + w * 0.3)) * 50
          + Math.sin(nx * 7 - t * 0.8) * 20
          + Math.cos(nx * 2.5 + t * 0.4 + w) * 30;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `hsla(${waveHue}, 60%, 75%, ${waveAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // ===============================
  // MOUSE GLOW EFFECT
  // ===============================
  function drawMouseGlow() {
    if (mouse.x < 0) return;

    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
    grad.addColorStop(0, 'rgba(130, 160, 255, 0.08)');
    grad.addColorStop(0.4, 'rgba(170, 140, 255, 0.04)');
    grad.addColorStop(1, 'rgba(130, 160, 255, 0)');

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ===============================
  // MAIN LOOP
  // ===============================
  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);

    drawAurora();
    drawBlobs();
    updateShapes();
    drawDust();
    drawMouseGlow();

    animId = requestAnimationFrame(animate);
  }

  // --- Init & Start ---
  resize();
  initBlobs();
  initShapes();
  initDust();
  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
})();
