// ===== Carousel =====
const track = document.getElementById('carouselTrack');
const slides = Array.from(track.children);
const btnPrev = document.querySelector('.arrow.prev');
const btnNext = document.querySelector('.arrow.next');
const dotsWrap = document.getElementById('dots');

let index = 0;
const total = slides.length;
let autoTimer = null;

// Crear dots según cantidad de slides
function buildDots(){
  dotsWrap.innerHTML = '';
  for(let i=0;i<total;i++){
    const d = document.createElement('button');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.setAttribute('aria-label', `Ir al slide ${i+1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
}
buildDots();

function updateUI(){
  track.style.transform = `translateX(${-index * 100}%)`;
  const allDots = dotsWrap.querySelectorAll('.dot');
  allDots.forEach((d,i)=>d.classList.toggle('active', i===index));
}

function next(){ index = (index + 1) % total; updateUI(); }
function prev(){ index = (index - 1 + total) % total; updateUI(); }
function goTo(i){ index = i % total; updateUI(); }

// Auto-slide
function startAuto(){ autoTimer = setInterval(next, 5000); }
function stopAuto(){ clearInterval(autoTimer); }

btnNext.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
btnPrev.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });

// Pausar al pasar el mouse encima del carrusel
const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', stopAuto);
carousel.addEventListener('mouseleave', startAuto);

// Accesibilidad con teclado
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight') { next(); stopAuto(); startAuto(); }
  if(e.key === 'ArrowLeft')  { prev(); stopAuto(); startAuto(); }
});

// Iniciar
updateUI();
startAuto();
