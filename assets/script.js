(() => {
  const config = window.SOLE_CONFIG || {};
  const root = document.documentElement;
  let language = localStorage.getItem('sole-language') || 'al';

  const menuData = {
    sharing: {
      image: 'assets/images/ig_a1.webp',
      alt: { al: 'Përgatitje në Solé Lounge', en: 'Preparation at Solé Lounge' },
      items: [
        ['Krudo premium deti','Premium Seafood Crudo','5,000 L'],
        ['Mix djathërash dhe proshutash','Cheese & Charcuterie Board','2,500 L'],
        ['Të arta dhe krokante nga deti','Golden & Crispy Seafood','1,800 L'],
        ['Tacos me karkaleca','Shrimp Tacos','1,500 L'],
        ['Mix pule krokante','Crispy Chicken Mix','1,500 L'],
        ['Brusketa me salmon gravlax dhe Philadelphia','Gravlax Salmon & Philadelphia Bruschetta','1,000 L'],
        ['Brusketa me açuge të marinuara dhe krem djathi','Marinated Anchovy & Cream Cheese Bruschetta','1,000 L'],
        ['Patate me tartuf dhe Parmigiano','Truffle & Parmesan Fries','600 L'],
        ['Patate të skuqura','French Fries','400 L']
      ]
    },
    pizza: {
      image: 'assets/images/ig_b9.webp',
      alt: { al: 'Atmosferë gastronomike në Solé Lounge', en: 'Dining atmosphere at Solé Lounge' },
      items: [
        ['Margherita','Margherita','550 L'],
        ['Proshutë','Ham Pizza','700 L'],
        ['Vegjetariane','Vegetarian Pizza','700 L'],
        ['Proshutë dhe sallam','Ham & Salami Pizza','750 L'],
        ['Diavola','Spicy Salami Pizza','750 L'],
        ['Kapriçioze','Capricciosa','750 L'],
        ['Katër stinët','Four Seasons Pizza','750 L'],
        ['Ton','Tuna Pizza','750 L'],
        ['Katër djathërat','Four Cheese Pizza','800 L'],
        ['Elegance','Elegance','1,000 L','Rukola, prosciutto crudo, domate qershi dhe Grana','Arugula, prosciutto crudo, cherry tomatoes and Grana'],
        ['Meravigliosa','Meravigliosa','1,000 L','Mozzarella, tartuf, prosciutto crudo dhe Gorgonzola','Mozzarella, truffle, prosciutto crudo and Gorgonzola'],
        ['Kristi','Kristi','1,000 L','Sallam pikant, misër, speca, krem tartufi dhe rukola','Spicy salami, corn, peppers, truffle cream and arugula']
      ]
    }
  };

  let activeCategory = 'sharing';

  function applyLanguage() {
    root.lang = language === 'al' ? 'sq' : 'en';
    document.querySelectorAll('[data-al][data-en]').forEach(el => {
      el.textContent = el.dataset[language];
    });
    document.querySelectorAll('.lang-toggle').forEach(toggle => {
      const spans = toggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active', span.textContent.trim().toLowerCase() === language));
    });
    document.title = language === 'al' ? 'Solé Lounge Shëngjin' : 'Solé Lounge Shëngjin | Mediterranean Lounge';
    renderMenu(activeCategory);
    applyConfigText();
  }

  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      language = language === 'al' ? 'en' : 'al';
      localStorage.setItem('sole-language', language);
      applyLanguage();
    });
  });

  function renderMenu(category) {
    activeCategory = category;
    const menu = menuData[category];
    const holder = document.getElementById('menuContent');
    if (!holder) return;
    const items = menu.items.map(item => {
      const main = language === 'al' ? item[0] : item[1];
      const secondary = language === 'al' ? item[1] : item[0];
      const ingredients = language === 'al' ? item[3] : item[4];
      return `<article class="menu-item">
        <div>
          <p class="menu-item-name">${main}</p>
          ${secondary && secondary !== main ? `<p class="menu-item-en">${secondary}</p>` : ''}
          ${ingredients ? `<p class="menu-item-ingredients">${ingredients}</p>` : ''}
        </div>
        <span class="menu-price">${item[2]}</span>
      </article>`;
    }).join('');
    holder.innerHTML = `<figure class="menu-category-image"><img src="${menu.image}" alt="${menu.alt[language]}" loading="lazy"><figcaption>${category === 'sharing' ? 'APERITIV & SHARING' : 'PIZZA'}</figcaption></figure><div class="menu-list">${items}</div>`;
    document.querySelectorAll('.menu-tab').forEach(tab => {
      const active = tab.dataset.category === category;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  document.querySelectorAll('.menu-tab').forEach(tab => tab.addEventListener('click', () => renderMenu(tab.dataset.category)));

  const header = document.getElementById('siteHeader');
  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  addEventListener('scroll', setHeader, { passive: true });
  setHeader();

  const mobileMenu = document.getElementById('mobileMenu');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  function openMenu(open) {
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }
  menuToggle.addEventListener('click', () => openMenu(true));
  menuClose.addEventListener('click', () => openMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => openMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') { openMenu(false); closeLightbox(); } });

  const heroSlides = [...document.querySelectorAll('.hero-slide')];
  const progress = document.querySelector('.hero-progress');
  let heroIndex = 0;
  let heroTimer;
  heroSlides.forEach((_, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.ariaLabel = `Slide ${i + 1}`;
    button.addEventListener('click', () => setHero(i));
    progress.append(button);
  });
  const progressButtons = [...progress.children];
  function setHero(index) {
    clearInterval(heroTimer);
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
    progressButtons.forEach((button, i) => {
      button.classList.remove('active');
      void button.offsetWidth;
      button.classList.toggle('active', i === heroIndex);
    });
    heroTimer = setInterval(() => setHero(heroIndex + 1), 4800);
  }
  let heroTouchX = 0;
  document.querySelector('.hero').addEventListener('touchstart', e => heroTouchX = e.changedTouches[0].clientX, {passive:true});
  document.querySelector('.hero').addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - heroTouchX;
    if (Math.abs(diff) > 50) setHero(heroIndex + (diff < 0 ? 1 : -1));
  }, {passive:true});
  setHero(0);

  const nightSlides = [...document.querySelectorAll('.night-slide')];
  let nightIndex = 0;
  setInterval(() => {
    nightSlides[nightIndex].classList.remove('active');
    nightIndex = (nightIndex + 1) % nightSlides.length;
    nightSlides[nightIndex].classList.add('active');
    const bar = document.querySelector('.night-progress');
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }, 3800);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  function applyConfigLinks() {
    document.querySelectorAll('[data-config-link="instagram"]').forEach(a => {
      a.href = config.instagram || '#'; a.target = '_blank'; a.rel = 'noopener';
    });
    document.querySelectorAll('[data-config-link="maps"]').forEach(a => {
      a.href = config.maps || '#'; a.target = '_blank'; a.rel = 'noopener';
    });
    const phoneBar = document.querySelector('.bottom-phone');
    if (config.phoneLink) {
      phoneBar.href = `tel:${config.phoneLink}`;
      phoneBar.removeAttribute('aria-disabled');
    } else {
      phoneBar.href = config.instagram || '#';
      phoneBar.target = '_blank';
      phoneBar.querySelector('span:last-child').dataset.al = 'Instagram';
      phoneBar.querySelector('span:last-child').dataset.en = 'Instagram';
    }
  }

  function applyConfigText() {
    const phone = document.querySelector('.config-phone');
    if (phone && config.phoneDisplay) { phone.hidden = false; phone.textContent = config.phoneDisplay; }
    const hours = document.querySelector('.config-hours');
    const value = language === 'al' ? config.openingHoursAL : config.openingHoursEN;
    if (hours && value) { hours.hidden = false; hours.textContent = value; }
    else if (hours) hours.hidden = true;
  }

  applyConfigLinks();
  applyLanguage();

  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().slice(0,10);

  const form = document.getElementById('reservationForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const alMessage = `Përshëndetje Solé Lounge,\n\nDëshiroj të bëj një kërkesë për rezervim.\n\nEmri dhe mbiemri: ${data.get('name')}\nNumri i telefonit: ${data.get('phone')}\nData: ${data.get('date')}\nOra: ${data.get('time')}\nNumri i personave: ${data.get('guests')}\nPreferenca e tavolinës: ${data.get('preference')}\nMesazhi: ${data.get('message') || '-'}\n\nJu lutem më konfirmoni disponueshmërinë. Faleminderit.`;
    const enMessage = `Hello Solé Lounge,\n\nI would like to request a table reservation.\n\nFull name: ${data.get('name')}\nPhone number: ${data.get('phone')}\nDate: ${data.get('date')}\nTime: ${data.get('time')}\nNumber of guests: ${data.get('guests')}\nSeating preference: ${data.get('preference')}\nMessage: ${data.get('message') || '-'}\n\nPlease confirm availability. Thank you.`;
    const message = language === 'al' ? alMessage : enMessage;
    if (config.whatsapp) {
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      formStatus.textContent = language === 'al' ? 'Kërkesa po hapet në WhatsApp.' : 'Your request is opening in WhatsApp.';
    } else {
      try { await navigator.clipboard.writeText(message); } catch (_) {}
      formStatus.textContent = language === 'al'
        ? 'Mesazhi u kopjua. Numri i WhatsApp-it duhet të shtohet para publikimit.'
        : 'The message was copied. The WhatsApp number must be added before publishing.';
      if (config.instagram) setTimeout(() => window.open(config.instagram, '_blank', 'noopener'), 600);
    }
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCount = lightbox.querySelector('.lightbox-count');
  const galleryButtons = [...document.querySelectorAll('#galleryGrid button')];
  const galleryImages = galleryButtons.map(button => ({ src: button.querySelector('img').src, alt: button.querySelector('img').alt }));
  let lightboxIndex = 0;
  function showLightbox(index) {
    lightboxIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[lightboxIndex].src;
    lightboxImage.alt = galleryImages[lightboxIndex].alt;
    lightboxCount.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
  }
  galleryButtons.forEach((button, i) => button.addEventListener('click', () => showLightbox(i)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showLightbox(lightboxIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showLightbox(lightboxIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  let lightboxTouch = 0;
  lightbox.addEventListener('touchstart', e => lightboxTouch = e.changedTouches[0].clientX, {passive:true});
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - lightboxTouch;
    if (Math.abs(diff) > 45) showLightbox(lightboxIndex + (diff < 0 ? 1 : -1));
  }, {passive:true});
  addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
    if (e.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
  });

  const bottomBar = document.getElementById('mobileBottomBar');
  const footer = document.querySelector('footer');
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => bottomBar.classList.toggle('hidden', entry.isIntersecting));
  }, { threshold: .05 });
  footerObserver.observe(footer);

  document.getElementById('year').textContent = new Date().getFullYear();
})();
