(function () {
  'use strict';
  const menu = [
    { id: 'roll-caramel-apple', name: 'Caramel Apple loaded cinnamon roll', cents: 700 },
    { id: 'roll-biscoff', name: 'Biscoff loaded cinnamon roll', cents: 700 },
    { id: 'treat-biscoff', name: 'Biscoff Kitty Krispies Treat', cents: 500 },
    { id: 'treat-oreo', name: 'Oreo Kitty Krispies Treat', cents: 500 }
  ];
  const key = 'mgk_cart';
  let cart = {};
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    if (stored && typeof stored === 'object') {
      menu.forEach(item => {
        const q = stored[item.id];
        if (Number.isInteger(q) && q > 0 && q <= 99) cart[item.id] = q;
      });
    }
  } catch (e) {}

  const money = cents => '$' + (cents / 100).toFixed(2);
  function totals() {
    const subtotal = menu.reduce((sum, item) => sum + item.cents * (cart[item.id] || 0), 0);
    const tax = Math.round(subtotal * 825 / 10000);
    return { subtotal, tax, total: subtotal + tax };
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(cart)); } catch (e) {}
    render();
  }
  function summary() {
    const t = totals();
    const name = document.getElementById('order-name')?.value.trim() || '';
    const phone = document.getElementById('order-phone')?.value.trim() || '';
    const pickup = document.getElementById('order-pickup')?.value.trim() || '';
    const payment = document.querySelector('input[name=\"payment_method\"]:checked')?.value || 'Cash App';
    return [
      "Milo's Ghost Kitchen Order Request",
      'Name: ' + name,
      'Phone: ' + phone,
      'Pickup: ' + pickup,
      ...menu.filter(i => cart[i.id]).map(i => cart[i.id] + 'x ' + i.name + ' — ' + money(i.cents * cart[i.id])),
      'Subtotal: ' + money(t.subtotal),
      'Texas Tax (8.25%): ' + money(t.tax),
      'Final Total: ' + money(t.total),
      'Payment Choice: ' + payment
    ].join('\n');
  }
  function render() {
    const box = document.getElementById('cart-items-container');
    if (!box) return;
    box.replaceChildren();
    menu.forEach(item => {
      const qty = cart[item.id] || 0;
      if (!qty) return;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.padding = '10px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      const text = document.createElement('span');
      text.textContent = qty + 'x ' + item.name + ' — ' + money(qty * item.cents);
      const ctrls = document.createElement('div');
      ctrls.style.display = 'flex';
      ctrls.style.gap = '8px';
      for (const [lbl, delta] of [['−', -1], ['+', 1]]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = lbl;
        b.className = 'btn btn-secondary';
        b.style.padding = '4px 12px';
        b.style.fontSize = '0.9rem';
        b.onclick = () => {
          const n = (cart[item.id] || 0) + delta;
          if (n > 0) cart[item.id] = Math.min(n, 99);
          else delete cart[item.id];
          persist();
        };
        ctrls.append(b);
      }
      row.append(text, ctrls);
      box.append(row);
    });
    const t = totals();
    if (!t.subtotal) box.innerHTML = '<p style="color:var(--text-muted);padding:10px 0;">Your cart is empty — choose treats from the menu above.</p>';
    const subEl = document.getElementById('calc-subtotal');
    const taxEl = document.getElementById('calc-tax');
    const totEl = document.getElementById('calc-total');
    if (subEl) subEl.textContent = money(t.subtotal);
    if (taxEl) taxEl.textContent = money(t.tax);
    if (totEl) totEl.textContent = money(t.total);
    const submit = document.getElementById('submit-order-btn');
    if (submit) submit.disabled = !t.subtotal;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.add-to-cart-btn');
    if (!b) return;
    const item = menu.find(i => i.id === b.dataset.id);
    if (!item) return;
    cart[item.id] = Math.min((cart[item.id] || 0) + 1, 99);
    persist();
    alert(item.name + ' added to cart!');
  });
  const form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!totals().subtotal) return;
      const body = summary();
      const payment = document.querySelector('input[name=\"payment_method\"]:checked')?.value || 'Cash App';
      window.location.href = 'sms:+13468968007?body=' + encodeURIComponent(body);
      if (payment.includes('Square')) {
        setTimeout(() => { window.open('https://square.link/u/US9u61Vv?src=sheet', '_blank'); }, 1200);
      } else if (payment.includes('Cash App')) {
        setTimeout(() => { window.open('https://cash.app/$MilosGhostKitchen', '_blank'); }, 1200);
      }
    });
  }
  document.addEventListener('DOMContentLoaded', render);
  render();
})();
