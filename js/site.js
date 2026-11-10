(function() {
  'use strict';
  const DEFAULT_MENU = [
    { id: 'roll-black-magic', name: 'Black Magic Loaded Cinnamon Roll', category: "Signature Loaded Cinnamon Rolls", price: 7.00, desc: 'Giant cinnamon roll loaded with rich dark chocolate, decadent cream cheese frosting, and signature spooky bakery magic.' },
    { id: 'roll-biscoff', name: 'Biscoff Loaded Cinnamon Roll', category: "Signature Loaded Cinnamon Rolls", price: 7.00, desc: 'Giant cinnamon roll topped with cream cheese icing, warm cookie butter, caramel sauce, and crunchy Biscoff cookies.' },
    { id: 'treat-biscoff', name: 'Biscoff Kitty Krispies Treat', category: 'Kitty Krispies Treats', price: 5.00, desc: 'Crispy rice treat folded with gooey marshmallows, rich cookie butter, Biscoff crumbles, and caramel drizzle.' },
    { id: 'treat-oreo', name: 'Oreo Kitty Krispies Treat', category: 'Kitty Krispies Treats', price: 5.00, desc: 'Crispy rice treat packed with marshmallows, crushed Oreo cookies, and rich dark chocolate drizzle.' }
  ];
  function getCart() { try { return JSON.parse(localStorage.getItem('mgk_cart') || '{}'); } catch(e) { return {}; } }
  function saveCart(cart) { localStorage.setItem('mgk_cart', JSON.stringify(cart)); updateCartUI(); }
  function logTap(action, label) {
    try {
      const taps = JSON.parse(localStorage.getItem('mgk_taps') || '[]');
      taps.push({ action, label, time: new Date().toISOString() });
      localStorage.setItem('mgk_taps', JSON.stringify(taps));
    } catch(e) {}
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
      logTap('add_to_cart', id);
      alert('Added to cart!');
    }
  });
  const form = document.getElementById('order-form');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      logTap('checkout_submit', 'Customer placed order');
      const cart = getCart();
      const ids = Object.keys(cart).filter(id => cart[id] > 0);
      if (ids.length === 0) { alert('Cart is empty!'); return; }
      const name = document.getElementById('order-name').value;
      const phone = document.getElementById('order-phone').value;
      const pickup = document.getElementById('order-pickup').value;
      const payment = document.querySelector('input[name="payment_method"]:checked')?.value || 'Cash App';
      let subtotal = 0;
      const items = [];
      ids.forEach(id => {
        const item = DEFAULT_MENU.find(m => m.id === id);
        if (item) {
          subtotal += item.price * cart[id];
          items.push({ name: item.name, qty: cart[id], total: item.price * cart[id] });
        }
      });
      const tax = Math.round(subtotal * 8.25) / 100;
      const total = subtotal + tax;
      const order = { id: 'MGK-' + Math.floor(10000 + Math.random() * 90000), name, phone, pickupDay: pickup, paymentMethod: payment, items, total, status: 'received' };
      const orders = JSON.parse(localStorage.getItem('mgk_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('mgk_orders', JSON.stringify(orders));
      localStorage.removeItem('mgk_cart');
      alert('Order ' + order.id + ' placed successfully! Redirecting...');
      window.location.href = 'track.html?code=' + order.id + '&phone=' + encodeURIComponent(phone);
    };
  }
  document.addEventListener('DOMContentLoaded', updateCartUI);
})();