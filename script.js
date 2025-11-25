// Basic interactivity: scroll reveal, skill animations, portfolio modal, filters, contact form submit handler
document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll reveal using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => obs.observe(r));

  // Animate skill bars when skills section enters
  const skillsSection = document.getElementById('skills');
  if(skillsSection){
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          document.querySelectorAll('.skill-bar').forEach(bar => {
            const target = parseInt(bar.dataset.target || '0', 10);
            const fill = bar.querySelector('.skill-fill');
            const percentEl = bar.previousElementSibling?.querySelector('.skill-percent');
            if(fill){
              // animate width
              fill.style.width = target + '%';
              // animate percent number
              if(percentEl){
                let start = 0;
                const duration = 900;
                const stepTime = Math.max(10, Math.floor(duration / target));
                const timer = setInterval(() => {
                  start += 1;
                  percentEl.textContent = start + '%';
                  if(start >= target) clearInterval(timer);
                }, stepTime);
              }
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.2});
    skillsObserver.observe(skillsSection);
  }

  // Portfolio filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projects.forEach(p => {
        if(filter === 'all' || p.dataset.type === filter){
          p.style.display = '';
          // slight stagger reveal
          p.style.opacity = 0;
          setTimeout(()=> p.style.opacity = 1, 60);
        } else {
          p.style.display = 'none';
        }
      });
    });
  });

  // Portfolio modal
  const modal = document.getElementById('projectModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = document.querySelector('.modal-close');

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const img = btn.dataset.img;
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      openModal(img,title,desc);
    });
  });
  // allow keyboard open via Enter on project articles
  document.querySelectorAll('.project').forEach(p => {
    p.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        const btn = p.querySelector('.view-btn');
        if(btn) btn.click();
      }
    });
  });

  function openModal(img, title, desc){
    modalImage.src = img;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    modalImage.src = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Contact form submission (Formspree or similar)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Mengirim...';
      const formData = new FormData(contactForm);

      // Use action attribute as endpoint
      const action = contactForm.getAttribute('action');
      try{
        const resp = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        if(resp.ok){
          contactForm.reset();
          formStatus.textContent = 'Terima kasih! Pesan telah terkirim.';
        } else {
          const data = await resp.json();
          if(data?.errors){
            formStatus.textContent = data.errors.map(e => e.message).join(', ');
          } else {
            formStatus.textContent = 'Terjadi masalah saat mengirim. Coba lagi nanti.';
          }
        }
      } catch(err){
        formStatus.textContent = 'Gagal mengirim. Periksa koneksi atau endpoint.';
      }
      setTimeout(()=> formStatus.textContent = '', 5000);
    });
  }

  // Small enhancement: smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Optional: download CV via JS to ensure cross-browser download if needed
  const downloadBtn = document.getElementById('downloadCv');
  if(downloadBtn){
    downloadBtn.addEventListener('click', (e) => {
      // Default anchor download will handle; this is a progressive enhancement if you want to fetch and download via blob.
      // If providing a dynamic CV generation, implement fetch + blob here.
    });
  }
});