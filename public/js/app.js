// app.js — clean single-file implementation
document.addEventListener('DOMContentLoaded', function(){
  // year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // mobile nav toggle
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
    window.addEventListener('resize', ()=>{
      if(window.innerWidth>700){ navLinks.style.display='flex'; navLinks.style.flexDirection='row'; }
    });
  }

  // Reveal NOS headings when section scrolls into view
  const nosSection = document.querySelector('.the-nos');
  if(nosSection){
    const nosLayers = nosSection.querySelectorAll('.nos-layer');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          nosLayers.forEach(el => el.classList.add('is-visible'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(nosSection);
  }

  // Ring-style 3D carousel class
  class CarouselRing {
    constructor(root){
      this.root = root;
      this.track = root.querySelector('.carousel-track');
      this.items = Array.from(root.querySelectorAll('.carousel-item'));
      this.n = this.items.length;
      if(this.n === 0) return;
      this.idx = 0;
      this.auto = root.dataset.autoplay === 'true';
      this.interval = parseInt(root.dataset.interval || 4000, 10);
      this.timer = null;
      this._buildDots();
      this._measureAndLayout();
      this._bindEvents();
      this.goTo(0, false);
      setTimeout(()=>{ this._measureAndLayout(); this.goTo(this.idx, false); }, 120);
      if(this.auto) this.start();
    }

    _buildDots(){
      this.dotsWrap = this.root.querySelector('.carousel-dots');
      if(!this.dotsWrap) return;
      this.dotsWrap.innerHTML = '';
      for(let i=0;i<this.n;i++){
        const b = document.createElement('button');
        b.addEventListener('click', ()=> this.goTo(i));
        if(i===0) b.classList.add('active');
        this.dotsWrap.appendChild(b);
      }
    }

    _measureAndLayout(){
      const containerW = this.root.offsetWidth || (this.track.parentElement ? this.track.parentElement.offsetWidth : 1000);
      this.itemW = Math.round(Math.min(containerW * 0.6, 1000));
      this.itemH = this.items[0] ? this.items[0].offsetHeight || Math.round(this.itemW * 0.56) : Math.round(this.itemW * 0.56);
      this.root.style.perspective = this.root.style.perspective || '1200px';
      this.track.style.transformStyle = 'preserve-3d';
      this.track.style.position = 'relative';
      this.track.style.height = this.itemH + 'px';

      // small tweak: neighbors peek ~50% behind center
      this.spacingX = Math.round(this.itemW * 0.5);
      this.frontZ = 160;
      this.stepZ = 90;

      this.items.forEach((it,i)=>{
        it.style.position = 'absolute';
        it.style.left = '50%';
        it.style.top = '50%';
        it.style.width = Math.round(this.itemW) + 'px';
        it.style.height = this.itemH + 'px';
        it.style.transformOrigin = '50% 50%';
        it.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), opacity 320ms';
      });

      this.track.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1)';
    }

    _bindEvents(){
      const prev = this.root.querySelector('.carousel-prev');
      const next = this.root.querySelector('.carousel-next');
      if(prev) prev.addEventListener('click', ()=> this.prev());
      if(next) next.addEventListener('click', ()=> this.next());

      let sx=0, dx=0, down=false;
      this.track.addEventListener('pointerdown', (e)=>{ down=true; sx=e.clientX; this.stop(); this.track.setPointerCapture && this.track.setPointerCapture(e.pointerId); });
      this.track.addEventListener('pointermove', (e)=>{ if(!down) return; dx = e.clientX - sx; });
      this.track.addEventListener('pointerup', ()=>{ down=false; if(Math.abs(dx) > 40){ dx<0 ? this.next() : this.prev(); } dx=0; this.start(); });
      this.track.addEventListener('pointercancel', ()=>{ down=false; dx=0; this.start(); });

      window.addEventListener('resize', ()=>{ this._measureAndLayout(); this.goTo(this.idx, false); });
    }

    goTo(i, resetAuto = true){
      this.idx = ((i % this.n) + this.n) % this.n;
      for(let j=0;j<this.n;j++){
        const len = this.n;
        let raw = j - this.idx;
        while(raw > len/2) raw -= len;
        while(raw < -len/2) raw += len;
        const d = raw;
        const absd = Math.abs(d);

        // center at 0; neighbors offset by roughly half the item width
        let offsetX = 0;
        if(absd === 0){
          offsetX = 0;
        } else if(absd === 1){
          offsetX = Math.sign(d) * (this.itemW * 0.5 + 0);
        } else {
          offsetX = Math.sign(d) * (this.itemW * 0.5 + (absd - 1) * (this.spacingX + 20));
        }

        const z = (absd === 0) ? this.frontZ : -Math.min(absd * this.stepZ, 600);
        const scale = (absd === 0) ? 1.02 : Math.max(1 - absd * 0.04, 0.7);

        const it = this.items[j];
        // translateX is positive to place items left/right relative to center, then translate(-50%,-50%) recenters
        it.style.transform = `translateX(${offsetX}px) translateZ(${z}px) scale(${scale}) translate(-50%,-50%)`;
        it.style.zIndex = (absd === 0) ? 3000 : String(100 - Math.min(absd, 20));
        it.style.opacity = absd > 4 ? '0' : String(Math.max(1 - absd * 0.18, 0.18));
        it.style.pointerEvents = (absd === 0) ? 'auto' : 'none';
        it.classList.toggle('active', absd === 0);
      }

      if(this.dotsWrap){
        Array.from(this.dotsWrap.children).forEach((b,bi)=> b.classList.toggle('active', bi===this.idx));
      }

      if(resetAuto) this._resetAuto();
    }

    next(){ this.goTo(this.idx+1); }
    prev(){ this.goTo(this.idx-1); }

    start(){ if(this.timer) return; this.timer = setInterval(()=> this.next(), this.interval); }
    stop(){ if(this.timer){ clearInterval(this.timer); this.timer = null; } }
    _resetAuto(){ this.stop(); if(this.auto) this.start(); }
  }

  document.querySelectorAll('.carousel').forEach(c => new CarouselRing(c));

});
