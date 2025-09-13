// KAHUY HOUSE — main.js
(function(){
  const byId = (id)=>document.getElementById(id);
  const qs = (sel, el=document)=>el.querySelector(sel);
  const qsa = (sel, el=document)=>[...el.querySelectorAll(sel)];

  // 1) Load navbar from external file (navbar.html)
  async function loadNavbar(){
    const ph = qs('[data-include="navbar.html"]');
    if(!ph) return;
    try{
      const res = await fetch('navbar.html', {cache:'no-cache'});
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const header = doc.querySelector('.site-header');
      if(header){
        ph.replaceWith(header);
        initNav(header);
      }
    }catch(e){ console.warn('Gagal memuat navbar:', e); }
  }

  // 2) Init nav interactions (toggle + close on click)
  function initNav(scope=document){
    const toggle = qs('.nav__toggle', scope);
    const menu = qs('#nav-menu', scope);
    if (toggle && menu){
      toggle.addEventListener('click', ()=>{
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      qsa('#nav-menu a', scope).forEach(a=>{
        a.addEventListener('click', ()=> menu.classList.remove('open'));
      });
    }
  }

  // 3) Smooth scrolling for in‑page anchors
  function initSmoothScroll(){
    qsa('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href').slice(1);
        const target = byId(id);
        if (target){
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.pageYOffset - 72;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      });
    });
    // handle links like index.html#services when already on homepage
    qsa('a[href^="index.html#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href').split('#')[1];
        const target = byId(id);
        if (target){
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.pageYOffset - 72;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      });
    });
  }

  // 4) Reveal-on-scroll
  function initReveal(){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, {threshold: .12});
    qsa('.reveal').forEach(el=>io.observe(el));
  }

  // 5) Testimonials rotator
  function initTestimonials(){
    const quotes = qsa('.testimonials blockquote');
    let idx = 0;
    if (quotes.length){
      quotes[0].classList.add('active');
      setInterval(()=>{
        quotes[idx].classList.remove('active');
        idx = (idx+1) % quotes.length;
        quotes[idx].classList.add('active');
      }, 4200);
    }
  }

  // 6) Footer year
  function setYear(){
    const yEl = byId('year');
    if (yEl) yEl.textContent = new Date().getFullYear();
  }

  // Bootstrap
  document.addEventListener('DOMContentLoaded', ()=>{
    loadNavbar().then(()=>{
      initSmoothScroll();
      initReveal();
      initTestimonials();
      setYear();
    });
  });
})();
