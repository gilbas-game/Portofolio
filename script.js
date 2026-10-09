/**
 * LensaKu - Data-driven Portfolio
 * Content is loaded from content/ directory (5 JSON files)
 * To update: edit files in content/ folder, or use Decap CMS at /admin
 * No HTML/CSS/JS changes needed for content updates
 */

let siteData = null;

async function loadData() {
  try {
    const [settings, about, portfolio, services, contact] = await Promise.all([
      fetch('content/settings.json').then(r => { if (!r.ok) throw new Error('settings.json'); return r.json(); }),
      fetch('content/about.json').then(r => { if (!r.ok) throw new Error('about.json'); return r.json(); }),
      fetch('content/portfolio.json').then(r => { if (!r.ok) throw new Error('portfolio.json'); return r.json(); }),
      fetch('content/services.json').then(r => { if (!r.ok) throw new Error('services.json'); return r.json(); }),
      fetch('content/contact.json').then(r => { if (!r.ok) throw new Error('contact.json'); return r.json(); })
    ]);

    siteData = { ...settings, about, portfolio, services, contact };
    renderAll();
  } catch (error) {
    document.body.innerHTML = '<div style="padding:2rem;text-align:center;font-family:sans-serif;"><h2>Gagal memuat file konten</h2><p>Pastikan folder <strong>content/</strong> berisi 5 file JSON (settings, about, portfolio, services, contact)</p><p>Error: ' + error.message + '</p></div>';
    console.error('Error loading content:', error);
  }
}

function renderAll() {
  renderHeader();
  renderHero();
  renderAbout();
  renderPortfolio();
  renderServices();
  renderContact();
  renderFooter();
  initEventListeners();
  initAnimations();
}

function renderHeader() {
  const container = document.getElementById('header-container');
  const site = siteData.site;
  const nav = siteData.navigation;

  container.innerHTML = `
    <div class="logo">
      <h1><i class="fas fa-camera"></i> ${site.logoText}<span>${site.logoHighlight}</span></h1>
    </div>
    <nav>
      ${nav.map(item => `<a href="${item.href}"><i class="${item.icon}"></i> ${item.label}</a>`).join('')}
    </nav>
    <button class="menu-toggle" aria-label="Toggle navigation">
      <i class="fas fa-bars"></i>
    </button>
  `;
}

function renderHero() {
  const container = document.getElementById('hero-content');
  const hero = siteData.hero;

  document.querySelector('.hero').style.backgroundImage =
    `linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('${hero.backgroundImage}')`;

  container.innerHTML = `
    <h2 class="hero-title">${hero.title}</h2>
    <p class="hero-subtitle">${hero.subtitle}</p>
    <a href="${hero.buttonLink}" class="btn-primary">${hero.buttonText}</a>
  `;
}

function renderAbout() {
  document.getElementById('about-title').textContent = siteData.about.title;

  const container = document.getElementById('about-content');
  const about = siteData.about;

  container.innerHTML = `
    <div class="about-image">
      <div class="image-frame">
        <img src="${about.image}" alt="${about.imageAlt}" loading="lazy" decoding="async" onerror="this.classList.add('img-broken')">
      </div>
    </div>
    <div class="about-text">
      <h3>Halo, Saya <span class="highlight">${about.name}</span></h3>
      ${about.paragraphs.map(p => `<p>${p}</p>`).join('')}
      <div class="photo-stats">
        ${about.stats.map(stat => `
          <div class="stat">
            <h4>${stat.value}</h4>
            <p>${stat.label}</p>
          </div>
        `).join('')}
      </div>
      <div class="skills">
        <h4>Spesialisasi:</h4>
        <div class="skill-tags">
          ${about.specializations.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderPortfolio() {
  const portfolio = siteData.portfolio;
  document.getElementById('portfolio-title').textContent = portfolio.title;
  document.getElementById('portfolio-subtitle').textContent = portfolio.subtitle;

  const filtersContainer = document.getElementById('portfolio-filters');
  filtersContainer.innerHTML = portfolio.filters.map((f, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${f.value}">${f.label}</button>`
  ).join('');

  const grid = document.getElementById('portfolio-grid');
  grid.innerHTML = portfolio.items.map(item => `
    <div class="portfolio-item" data-category="${item.category}">
      <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" onerror="this.classList.add('img-broken')">
      <div class="portfolio-overlay">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="tag">${item.category}</span>
      </div>
    </div>
  `).join('');
}

function renderServices() {
  const services = siteData.services;
  document.getElementById('services-title').textContent = services.title;
  document.getElementById('services-subtitle').textContent = services.subtitle;

  const grid = document.getElementById('services-grid');
  grid.innerHTML = services.items.map(service => `
    <div class="service-card">
      <div class="service-icon">
        <i class="${service.icon}"></i>
      </div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <ul class="service-features">
        ${service.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderContact() {
  const contact = siteData.contact;
  document.getElementById('contact-title').textContent = contact.title;
  document.getElementById('contact-subtitle').textContent = contact.subtitle;

  const container = document.getElementById('contact-container');

  const contactCards = contact.cards.map(card => `
    <div class="contact-card ${card.type}-card">
      <div class="contact-icon">
        <i class="${card.icon}"></i>
      </div>
      <h4>${card.title}</h4>
      <p class="contact-description">${card.description}</p>
      ${card.details.map(d => `
        <div class="contact-detail">
          <i class="${d.icon}"></i>
          <span>${d.text}</span>
        </div>
      `).join('')}
      <a href="${card.buttonLink}" class="contact-btn ${card.type}-btn" target="_blank">
        <i class="${card.buttonIcon}"></i> ${card.buttonText}
      </a>
      <p class="contact-tip">
        <i class="fas fa-lightbulb"></i> ${card.tip}
      </p>
    </div>
  `).join('');

  const infoBoxes = contact.infoBoxes.map(box => `
    <div class="info-box">
      <i class="${box.icon}"></i>
      <div>
        <h5>${box.title}</h5>
        <p>${box.description}</p>
      </div>
    </div>
  `).join('');

  const cta = contact.cta;

  container.innerHTML = `
    <div class="contact-header">
      <h3><i class="${contact.header.icon}"></i> ${contact.header.title}</h3>
      <p>${contact.header.description}</p>
    </div>
    <div class="contact-main">
      ${contactCards}
    </div>
    <div class="contact-info">
      ${infoBoxes}
    </div>
    <div class="contact-cta">
      <h4>${cta.title}</h4>
      <p>${cta.description}</p>
      <a href="${cta.buttonLink}" class="cta-btn" target="_blank">
        <i class="${cta.buttonIcon}"></i> ${cta.buttonText}
      </a>
      <p class="cta-note">
        <i class="fas fa-comment-dots"></i> ${cta.note}
      </p>
    </div>
  `;
}

function renderFooter() {
  const footer = siteData.footer;
  const year = new Date().getFullYear();

  const content = document.getElementById('footer-content');
  content.innerHTML = `
    <div class="footer-logo">
      <h3><i class="fas fa-camera"></i> ${footer.logoText}<span>${footer.logoHighlight}</span></h3>
      <p>${footer.description}</p>
    </div>
    <div class="footer-links">
      <h4>Tautan Cepat</h4>
      ${footer.quickLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    </div>
    <div class="footer-newsletter">
      <h4>${footer.newsletterTitle}</h4>
      <p>${footer.newsletterDescription}</p>
      <div class="social-links">
        ${footer.socialLinks.map(s =>
          `<a href="${s.href}" target="_blank" class="social-btn ${s.class}"><i class="${s.icon}"></i></a>`
        ).join('')}
      </div>
    </div>
  `;

  document.getElementById('copyright').innerHTML = `
    <p>&copy; ${year} ${footer.copyright}</p>
    <p>${footer.madeWithText} <i class="${footer.madeWithIcon}"></i> ${footer.madeWithSuffix}</p>
  `;
}

function initEventListeners() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterPortfolio(button.getAttribute('data-filter'));
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        nav.classList.remove('active');
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    }
  });
}

function filterPortfolio(category) {
  const items = document.querySelectorAll('.portfolio-item');
  items.forEach(item => {
    if (category === 'all' || item.getAttribute('data-category') === category) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });
}

document.addEventListener('DOMContentLoaded', loadData);
