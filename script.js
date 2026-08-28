/* ── Gate — código de acceso ─────────────── */
const SECRET = "29082019";

window.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("gate");
  const input = document.getElementById("gate-input");
  const btn = document.getElementById("gate-btn");
  const error = document.getElementById("gate-error");

  function tryEnter() {
    if (input.value === SECRET) {
      gate.classList.add("open");
    } else {
      error.classList.add("show");
      input.value = "";
      input.focus();
      setTimeout(() => error.classList.remove("show"), 2500);
    }
  }

  btn.addEventListener("click", tryEnter);
  input.addEventListener("keydown", e => { if (e.key === "Enter") tryEnter() });
  input.focus();
});

const startDate = new Date("2019-08-29T08:30:00-05:00");


window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 900);
  updateCounter();
  setInterval(updateCounter, 1000);
  makeRandomGallery();
  initScrollReveal();
  initNavScroll();
});


function updateCounter() {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  const ann = new Date(startDate); ann.setFullYear(startDate.getFullYear() + years);
  if (now < ann) years--;
  const anchor = new Date(startDate); anchor.setFullYear(startDate.getFullYear() + years);
  let d = now - anchor;
  const day = 86400000, hour = 3600000, min = 60000;
  const days = Math.floor(d / day); d -= days * day;
  const hours = Math.floor(d / hour); d -= hours * hour;
  const minutes = Math.floor(d / min); d -= minutes * min;
  const seconds = Math.floor(d / 1000);
  document.getElementById("years").textContent = years;
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}



const numberedPhotos = [];
for (let i = 1; i <= 50; i++) {
  const num = String(i).padStart(2, '0');
  numberedPhotos.push(num + ".jpg");
}


const namedPhotos = [
  "scarlett01.jpg",
  "cuenca01.jpg",
  "graduacion.jpg",
  "cine.jpg",
  "comida.jpg",
  "nosotros.jpg",
];

const photoNames = [...numberedPhotos, ...namedPhotos];

function shuffle(a) { return [...a].sort(() => Math.random() - .5) }

function makeRandomGallery() {
  const gallery = document.getElementById("random-gallery");
  gallery.innerHTML = "";
  gallery.style.height = "0px";

  const shuffled = shuffle(photoNames);
  const SHOW = 14; 
  const loaded = [];
  let placed = 0;
  let failed = 0;
  let totalAttempts = Math.min(shuffled.length, SHOW);


  const sizes = [130, 150, 170, 180, 200, 160, 140, 190, 175, 155, 185, 145, 165, 195];


  const tapeStyles = ['', 'tape-top', 'tape-corner'];


  let maxBottom = 0;

  function finalizeGalleryHeight() {
    if (maxBottom > 0) {

      gallery.style.height = (maxBottom + 60) + "px";
    } else {

      gallery.style.height = "200px";
    }
  }

  shuffled.forEach((name, i) => {
    if (i >= SHOW) return;

    const card = document.createElement("div");
    card.className = "random-photo";


    const tape = tapeStyles[Math.floor(Math.random() * tapeStyles.length)];
    if (tape) card.classList.add(tape);

    const img = document.createElement("img");
    img.src = "assets/fotos/" + name;
    img.alt = "Un recuerdo de nosotros";

    img.onload = () => {
      placed++;
      loaded.push({ card, name, i: placed - 1 });
      positionPhoto(card, placed - 1, sizes[placed - 1] || 150);
      gallery.appendChild(card);


      requestAnimationFrame(() => {
        const photoTop = parseFloat(card.style.top);
        const photoHeight = card.offsetHeight;
        const bottomEdge = photoTop + photoHeight;
        if (bottomEdge > maxBottom) maxBottom = bottomEdge;


        if (placed + failed >= totalAttempts) {
          finalizeGalleryHeight();
        }
      });
    };
    img.onerror = () => {
      failed++;

      if (placed + failed >= totalAttempts && placed > 0) {
        finalizeGalleryHeight();
      }
    };

    card.appendChild(img);
  });

  setTimeout(() => {
    if (placed + failed < totalAttempts) {
      failed = totalAttempts - placed;
      finalizeGalleryHeight();
    }
  }, 8000);
}

function positionPhoto(card, index, size) {
  const gallery = document.getElementById("random-gallery");
  const galleryW = gallery.offsetWidth || 800;


  const cols = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);


  const colWidth = galleryW / cols;
  const baseX = colWidth * col + colWidth * 0.2;
  const randomX = Math.random() * (colWidth * 0.5);
  const x = Math.min(Math.max(baseX + randomX - size / 2, 10), galleryW - size - 10);


  const estimatedH = Math.round(size * 0.75) + 36;
  const baseY = row * 210 + 30;
  const randomY = Math.random() * 60 - 30;

  const y = Math.max(baseY + randomY, 10);

  const rot = -10 + Math.random() * 20; 
  const zIndex = 10 + index;

  card.style.left = x + "px";
  card.style.top = y + "px";
  card.style.width = size + "px";
  card.style.transform = `rotate(${rot}deg)`;
  card.style.setProperty('--base-rot', `rotate(${rot}deg)`);
  card.style.zIndex = zIndex;
  card.style.animation = `gentleFloat ${4 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`;
  card.style.opacity = '0';


  setTimeout(() => {
    card.style.transition = 'opacity .6s ease, transform .4s ease';
    card.style.opacity = '1';
  }, 200 + index * 150);

  // Hover brings to front
  card.addEventListener('mouseenter', () => { card.style.zIndex = 100 });
  card.addEventListener('mouseleave', () => { card.style.zIndex = zIndex });
}


let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const gallery = document.getElementById("random-gallery");
    const photos = gallery.querySelectorAll(".random-photo");
    if (!photos.length) return;
    let maxB = 0;
    photos.forEach(card => {
      const photoTop = parseFloat(card.style.top);
      const photoHeight = card.offsetHeight;
      const bottomEdge = photoTop + photoHeight;
      if (bottomEdge > maxB) maxB = bottomEdge;
    });
    if (maxB > 0) gallery.style.height = (maxB + 60) + "px";
  }, 200);
});


document.getElementById("shuffle").addEventListener("click", makeRandomGallery);


const envelope = document.getElementById("envelope");
document.getElementById("openLetter").addEventListener("click", () => {
  envelope.classList.toggle("open");
  const btn = document.getElementById("openLetter");
  btn.textContent = envelope.classList.contains("open") ? "cerrar mi carta" : "abrir mi carta ♡";
});


document.getElementById("loveButton").addEventListener("click", () => {
  for (let i = 0; i < 35; i++) {
    const h = document.createElement("div");
    h.className = "burst-heart";
    h.textContent = Math.random() > .2 ? "♡" : "♥";
    h.style.left = (45 + Math.random() * 10) + "%";
    h.style.top = (70 + Math.random() * 10) + "%";
    h.style.setProperty("--x", (Math.random() * 300 - 150) + "px");
    h.style.setProperty("--y", -(100 + Math.random() * 250) + "px");
    h.style.setProperty("--dur", (2 + Math.random() * 2.5) + "s");
    h.style.fontSize = (0.8 + Math.random() * 1) + "rem";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5500);
  }
});


function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("seen");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => {
    observer.observe(el);
  });
}


function initNavScroll() {
  const nav = document.getElementById("nav");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle("scrolled", window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  });
}