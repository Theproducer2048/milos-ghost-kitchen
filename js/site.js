(function() {
  'use strict';
  const DEFAULT_MENU = [
    { id: 'roll-caramel-apple', name: 'Caramel Apple Loaded Cinnamon Roll', category: "Milo's Purr-fectly Loaded Cinnamon Rolls", price: 7.00, desc: 'Giant cinnamon roll topped with warm spiced apples, rich caramel drizzle, and cream cheese icing.', image: 'images/roll-caramel-apple.jpg' },
    { id: 'roll-biscoff', name: 'Biscoff Loaded Cinnamon Roll', category: "Milo's Purr-fectly Loaded Cinnamon Rolls", price: 7.00, desc: 'Giant cinnamon roll topped with cream cheese icing, cookie butter, caramel sauce, and crunchy Biscoff cookies.', image: 'images/roll-biscoff.jpg' },
    { id: 'treat-biscoff', name: 'Biscoff Kitty Krispies Treat', category: 'Kitty Krispies Treats', price: 5.00, desc: 'Crispy rice treat folded with gooey marshmallows, rich cookie butter, Biscoff crumbles, and caramel drizzle.', image: 'images/treat-biscoff.jpg' },
    { id: 'treat-oreo', name: 'Oreo Kitty Krispies Treat', category: 'Kitty Krispies Treats', price: 5.00, desc: 'Crispy rice treat packed with marshmallows and crushed Oreo cookies, finished with dark chocolate drizzle.', image: 'images/treat-oreo.jpg' }
  ];
  function getCart() { try { return JSON.parse(localStorage.getItem('mgk_cart') || '{}'); } catch(e) { return {}; } }
  function saveCart(cart) { localStorage.setItem('mgk_cart', JSON.stringify(cart)); updateCartUI(); }
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._tt);
    window._tt = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function updateCartUI() {
    const cart = getCart();
    let subtotal = 0, count = 0;
    const container = document.getElementById('cart-items-container');
    if (container) {
      container.innerHTML = '';
      const ids = Object.keys(cart);
      if (ids.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:10px 0;">Your cart is empty — choose treats from the menu above.</p>';
      } else {
        ids.forEach(id => {
          const qty = cart[id];
          const item = DEFAULT_MENU.find(m => m.id === id);
          if (item && qty > 0) {
            const line = item.price * qty;
            subtotal += line;
            count += qty;
            const r = document.createElement('div');
            r.style.display = 'flex';
            r.style.justifyContent = 'space-between';
            r.style.padding = '8px 0';
            r.innerHTML = `<span>${qty}x ${item.name}</span><strong>$${line.toFixed(2)}</strong>`;
            container.appendChild(r);
          }
        });
      }
    }
    const tax = Math.round(subtotal * 8.25) / 100;
    const total = subtotal + tax;
    const subEl = document.getElementById('calc-subtotal');
    const taxEl = document.getElementById('calc-tax');
    const totalEl = document.getElementById('calc-total');
    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    const btn = document.getElementById('submit-order-btn');
    if (btn) btn.disabled = (count === 0);
  }
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const cart = getCart();
      cart[id] = (cart[id] || 0) + 1;
      saveCart(cart);
      showToast('Added to cart!');
    }
    const copy = e.target.closest('.copy-handle');
    if (copy) {
      navigator.clipboard.writeText('@milosghostkitchen').then(() => showToast('TikTok handle copied!'));
    }
  });
  document.addEventListener('DOMContentLoaded', updateCartUI);
})();