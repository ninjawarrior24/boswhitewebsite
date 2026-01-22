document.addEventListener('DOMContentLoaded',function(){
  // year
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', ()=>{
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '8px';
      navLinks.style.alignItems = 'flex-start';
    });
    // reset on resize
    window.addEventListener('resize', ()=>{
      if(window.innerWidth>700){ navLinks.style.display='flex'; navLinks.style.flexDirection='row';}
    })
  }
});

// Simple carousel initializer
document.addEventListener('DOMContentLoaded', function(){
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((carousel)=>{
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    if(!track || items.length===0) return;

    let idx = 0;
    const setPosition = ()=>{
      track.style.transform = `translateX(-${idx*100}%)`;
      const dots = dotsWrap.querySelectorAll('button');
      dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
    }

    // build dots
    items.forEach((_,i)=>{
      const b = document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click', ()=>{ idx=i; setPosition(); });
      dotsWrap.appendChild(b);
    });

    if(next) next.addEventListener('click', ()=>{ idx = (idx+1)%items.length; setPosition(); resetAuto(); });
    if(prev) prev.addEventListener('click', ()=>{ idx = (idx-1+items.length)%items.length; setPosition(); resetAuto(); });

    // autoplay
    let interval = parseInt(carousel.dataset.interval || 4000,10);
    let auto = carousel.dataset.autoplay === 'true';
    let timer = null;
    const startAuto = ()=>{ if(auto) timer = setInterval(()=>{ idx = (idx+1)%items.length; setPosition(); }, interval); };
    const resetAuto = ()=>{ if(timer) clearInterval(timer); startAuto(); };
    startAuto();
  });
});
