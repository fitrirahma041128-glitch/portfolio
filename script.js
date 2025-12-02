// ===== Neo-Interactive Script =====
document.addEventListener("DOMContentLoaded", () => {
  
  /* -----------------------------------------------------
   * 1. FOOTER YEAR
  ----------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* -----------------------------------------------------
   * 2. SCROLL REVEAL
  ----------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach(el => revealObserver.observe(el));


  /* -----------------------------------------------------
   * 3. SKILL BAR ANIMATION (requestAnimationFrame)
  ----------------------------------------------------- */
  const skillsSection = document.getElementById("skills");

  if (skillsSection) {
    const skillObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".skill-bar").forEach(bar => {
              const target = parseInt(bar.dataset.target || 0, 10);
              const fill = bar.querySelector(".skill-fill");
              const percentEl = bar.closest(".skill").querySelector(".skill-percent");

              if (!fill) return;

              // Animate width
              fill.style.width = target + "%";

              // Animate percentage (using rAF)
              let current = 0;
              const animatePercent = () => {
                if (current <= target) {
                  percentEl.textContent = current + "%";
                  current++;
                  requestAnimationFrame(animatePercent);
                }
              };
              animatePercent();
            });

            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    skillObserver.observe(skillsSection);
  }


  /* -----------------------------------------------------
   * 4. PORTFOLIO FILTER
  ----------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      let delay = 0;
      projects.forEach(proj => {
        if (filter === "all" || proj.dataset.type === filter) {
          proj.style.display = "block";
          proj.style.opacity = 0;

          // stagger animation
          setTimeout(() => {
            proj.style.transition = "opacity .4s ease, transform .4s ease";
            proj.style.opacity = 1;
            proj.style.transform = "translateY(0)";
          }, delay);

          delay += 80;
        } else {
          proj.style.opacity = 0;
          proj.style.transform = "translateY(20px)";
          setTimeout(() => (proj.style.display = "none"), 300);
        }
      });
    });
  });


  /* -----------------------------------------------------
   * 5. MODAL PORTFOLIO
  ----------------------------------------------------- */
  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalClose = document.querySelector(".modal-close");

  const openModal = (img, title, desc) => {
    modalImage.src = img;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => (modalImage.src = ""), 300);
  };

  // Open via .view-btn
  document.addEventListener("click", e => {
    const btn = e.target.closest(".view-btn");
    if (btn) {
      openModal(btn.dataset.img, btn.dataset.title, btn.dataset.desc);
    }
  });

  // Keyboard open when focus on project + Enter
  document.querySelectorAll(".project").forEach(p => {
    p.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const btn = p.querySelector(".view-btn");
        if (btn) btn.click();
      }
    });
  });

  // Close events
  modalClose?.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });


  /* -----------------------------------------------------
   * 6. CONTACT FORM SUBMISSION
  ----------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();

      formStatus.textContent = "Mengirim...";
      formStatus.style.color = "var(--primary)";

      const formData = new FormData(contactForm);

      try {
        const endpoint = contactForm.getAttribute("action");
        const resp = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (resp.ok) {
          contactForm.reset();
          formStatus.textContent = "✓ Pesan berhasil dikirim!";
          formStatus.style.color = "var(--accent)";
        } else {
          formStatus.textContent = "❗ Gagal mengirim. Coba lagi.";
          formStatus.style.color = "crimson";
        }
      } catch (err) {
        formStatus.textContent = "⚠ Tidak ada koneksi ke server.";
        formStatus.style.color = "crimson";
      }

      setTimeout(() => (formStatus.textContent = ""), 4500);
    });
  }


  /* -----------------------------------------------------
   * 7. SMOOTH SCROLL
  ----------------------------------------------------- */
  document.addEventListener("click", e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = link.getAttribute("href");
    if (target.length > 1) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });


  /* -----------------------------------------------------
   * 8. DOWNLOAD CV (Optional Enhancement)
  ----------------------------------------------------- */
  const downloadBtn = document.getElementById("downloadCv");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      // Bisa dibuat fetch+blob jika butuh versi dinamis.
      // Kosongkan bila tidak perlu.
    });
  }
});
