/* =============================================
   DIGITAL PORTFOLIO — APP.JS
   ============================================= */

// ===== TYPING ANIMATION =====
const names  = ['Nguyễn Xuân Phúc', 'Sinh viên CNTT', 'Digital Learner', 'AI Enthusiast'];
let nIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
  const current = names[nIdx];
  typingEl.textContent = deleting ? current.slice(0, --cIdx) : current.slice(0, ++cIdx);

  const delay = deleting ? 55 : cIdx === current.length ? 2000 : 75;

  if (!deleting && cIdx === current.length) { deleting = true; }
  else if (deleting && cIdx === 0)           { deleting = false; nIdx = (nIdx + 1) % names.length; }

  setTimeout(typeLoop, delay);
}
typeLoop();


// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    top:  ${Math.random() * 100}%;
    width:  ${Math.random() * 3 + 1}px;
    height: ${Math.random() * 3 + 1}px;
    opacity: ${Math.random() * .4 + .1};
    animation-duration: ${Math.random() * 15 + 8}s;
    animation-delay: ${Math.random() * 8}s;
    background: ${Math.random() > .5 ? '#ff7043' : '#7c4dff'};
  `;
  particlesContainer.appendChild(p);
}


// ===== NAVBAR SCROLL + ACTIVE =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}, { passive: true });


// ===== MOBILE NAV TOGGLE =====
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Close mobile nav on link click
navLinks.forEach(l => l.addEventListener('click', () => {
  document.getElementById('navLinks').classList.remove('open');
}));


// ===== SMOOTH SCROLL OVERRIDE (for iOS/safari) =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = +el.dataset.target;
    const isFloat = target < 5;
    let count     = 0;
    const step    = target / 60;
    const timer   = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = isFloat ? count.toFixed(0) : Math.floor(count);
    }, 20);
  });
}

// ===== SKILL BAR ANIMATION =====
function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger special animations based on section
      if (entry.target.id === 'home') animateCounters();
      if (entry.target.id === 'summary') {
        setTimeout(animateSkillBars, 300);
      }
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => observer.observe(s));

// Reveal on scroll
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.project-card, .summary-card, .timeline-item, .stat-card, .goal-item, .skills-card, .highlight-card, .challenges-card, .final-reflection').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// Animate counters on load if already in view
window.addEventListener('load', () => {
  const homeSection = document.getElementById('home');
  if (homeSection) {
    const rect = homeSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) animateCounters();
  }
});


// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeSlideUp .4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// ===== MODALS =====
function openModal(id) {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// ESC key closes modal
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ===== TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - .5;
    const y      = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'all .35s cubic-bezier(.4,0,.2,1)';
  });
});


// ===== GLOWING CURSOR ON HERO AVATAR =====
const avatarImg = document.getElementById('avatarImg');
if (avatarImg) {
  avatarImg.addEventListener('mousemove', e => {
    const rect = avatarImg.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    avatarImg.style.objectPosition = `${x}% ${y}%`;
  });
  avatarImg.addEventListener('mouseleave', () => {
    avatarImg.style.objectPosition = 'center top';
  });
}


// ===== INTEREST CHIP RIPPLE =====
document.querySelectorAll('.interest-chip').forEach(chip => {
  chip.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; width:4px; height:4px; background:rgba(255,112,67,.6);
      border-radius:50%; transform:scale(0); animation:ripple .6s linear;
      left:${e.offsetX}px; top:${e.offsetY}px; pointer-events:none;
    `;
    chip.style.position = 'relative'; chip.style.overflow = 'hidden';
    chip.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(30); opacity: 0; } }`;
document.head.appendChild(style);


// ===== PARALLAX ORB ON MOUSE MOVE =====
document.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth  - .5) * 30;
  const my = (e.clientY / window.innerHeight - .5) * 30;
  document.querySelectorAll('.bg-orb').forEach((orb, i) => {
    const factor = (i + 1) * .5;
    orb.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
  });
}, { passive: true });

console.log('%c✦ Portfolio Kỹ Thuật Số — Nguyễn Xuân Phúc', 'background:#ff7043;color:#fff;padding:8px 16px;border-radius:4px;font-weight:700;font-size:14px;');
