(() => {
  'use strict';
  const CHECKOUT = 'https://pay.hotmart.com/C108545380E?checkoutMode=2';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep navigation and readable content useful even when JavaScript is unavailable.
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  function closeMenu() {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    $('use', menuToggle).setAttribute('href', '#i-menu');
  }
  menuToggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    $('use', menuToggle).setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  $$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); }
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), {passive: true});
  header.classList.toggle('scrolled', window.scrollY > 10);

  const examples = {
    garden: {brand: 'verde.', kicker: 'ESPACIOS QUE SE SIENTEN BIEN', heading: 'Tu jardín.<br>Tu lugar favorito.', image: 'assets/garden.webp', alt: 'Jardín de una vivienda moderna, usado para un ejemplo de diseño web', cta: 'Diseñemos tu espacio', service: 'Diseño de jardines', accent: '#d8efb6', background: '#244c36', icon: '#i-leaf'},
    home: {brand: 'forma.', kicker: 'IDEAS QUE SE CONVIERTEN EN HOGAR', heading: 'Tu espacio.<br>Una nueva forma.', image: 'assets/pool.webp', alt: 'Casa moderna con grandes ventanales, usada para un ejemplo de diseño de remodelación', cta: 'Planeemos tu proyecto', service: 'Diseño y remodelación', accent: '#f0d6b6', background: '#3e352b', icon: '#i-layers'}
  };
  const tabs = $$('[data-example]');
  function setExample(name, focus = false) {
    const ex = examples[name];
    if (!ex) return;
    tabs.forEach(tab => { const selected = tab.dataset.example === name; tab.classList.toggle('is-active', selected); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); });
    $('#example-screen').setAttribute('aria-labelledby', `tab-${name}`);
    $('[data-example-brand]').textContent = ex.brand;
    $('[data-example-kicker]').textContent = ex.kicker;
    $('[data-example-heading]').innerHTML = ex.heading;
    $('[data-example-image]').src = ex.image;
    $('[data-example-image]').alt = ex.alt;
    $('[data-example-cta]').textContent = ex.cta;
    $('[data-example-cta]').style.background = ex.accent;
    $('[data-example-service]').textContent = ex.service;
    $('.mini-contact').style.background = ex.background;
    $('.mini-logo use').setAttribute('href', ex.icon);
    $('[data-phone-brand]').textContent = ex.brand;
    $('[data-phone-image]').src = ex.image;
    $('[data-phone-heading]').innerHTML = ex.heading;
    $('[data-phone-cta]').textContent = ex.cta;
    $('[data-phone-cta]').style.background = ex.accent;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setExample(tab.dataset.example));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setExample(tabs[next].dataset.example, true);
    });
  });

  $$('.course-accordion details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) $$('.course-accordion details').forEach(other => { if (other !== detail) other.open = false; });
  }));

  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-motion');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), {threshold: 0.08});
    $$('.reveal').forEach(element => reveal.observe(element));
  }

  const mobileBar = $('.mobile-purchase');
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  let heroVisible = true;
  let offerVisible = false;
  function updateMobileBar() { mobileBar.hidden = !mobileQuery.matches || heroVisible || offerVisible; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; updateMobileBar(); }, {threshold: 0}).observe($('#hero-checkout'));
    new IntersectionObserver(entries => { offerVisible = entries[0].isIntersecting; updateMobileBar(); }, {threshold: 0.1}).observe($('.offer-purchase'));
    mobileQuery.addEventListener('change', updateMobileBar);
  }
  $('#year').textContent = new Date().getFullYear();

  // The official widget binds to its hidden anchor. Visible controls remain usable if a network
  // or health-check failure removes Hotmart anchors; the direct, unmodified checkout is the fallback.
  const checkoutDialog = $('#checkout-dialog');
  const checkoutFrame = $('#checkout-frame');
  let checkoutTrigger = null;
  function directCheckout() { window.open(CHECKOUT, '_blank', 'noopener,noreferrer'); }
  function openCheckout() {
    checkoutTrigger = document.activeElement;
    if (window.innerWidth <= 700) {
      directCheckout();
    } else if (typeof checkoutDialog.showModal === 'function') {
      checkoutFrame.src = CHECKOUT;
      document.body.classList.add('checkout-open');
      checkoutDialog.showModal();
    } else if (window.jQuery && window.jQuery.fancybox && typeof window.jQuery.fancybox.open === 'function') {
      window.jQuery.fancybox.open({src: CHECKOUT, type: 'iframe', opts: {toolbar: false, smallBtn: true, iframe: {css: {width: '650px'}, attr: {allowpaymentrequest: 'true', title: 'Pago seguro en Hotmart'}}}});
    } else {
      directCheckout();
    }
  }
  $('#close-checkout').addEventListener('click', () => checkoutDialog.close());
  $('#checkout-new-tab').addEventListener('click', directCheckout);
  checkoutDialog.addEventListener('close', () => { document.body.classList.remove('checkout-open'); checkoutFrame.src = 'about:blank'; if (checkoutTrigger) checkoutTrigger.focus(); });
  checkoutDialog.addEventListener('click', event => { if (event.target === checkoutDialog) { const box = checkoutDialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) checkoutDialog.close(); } });
  $$('[data-checkout]').forEach(button => button.addEventListener('click', openCheckout));
  $$('[data-external]').forEach(button => button.addEventListener('click', () => window.open(button.dataset.external, '_blank', 'noopener,noreferrer')));
  function importHotmart() {
    if ($('#hotmart-widget-script')) return;
    const imported = document.createElement('script');
    imported.id = 'hotmart-widget-script';
    imported.type = 'text/javascript';
    imported.src = 'https://static.hotmart.com/checkout/widget.min.js';
    document.head.appendChild(imported);
  }
  importHotmart();
})();
