(function() {
  'use strict';
  const OWNER_EMAIL = 'milosghostkitchen@gmail.com';
  function getPasscode() { return localStorage.getItem('mgk_admin_pass') || ''; }
  function setPasscode(p) { localStorage.setItem('mgk_admin_pass', p); }
  function isAuth() { return sessionStorage.getItem('mgk_admin_auth') === 'true'; }
  function setAuth(v) { if (v) sessionStorage.setItem('mgk_admin_auth', 'true'); else sessionStorage.removeItem('mgk_admin_auth'); }
  function initView() {
    const login = document.getElementById('login-view');
    const app = document.getElementById('app-view');
    const topR = document.getElementById('top-right');
    const form = document.getElementById('login-form');
    const err = document.getElementById('login-err');
    const pass = getPasscode();
    if (!pass) {
      const h = login.querySelector('h1');
      const p = login.querySelector('p');
      if (h) h.textContent = 'Owner Setup (Darius)';
      if (p) p.textContent = `Set your manager password for ${OWNER_EMAIL}.`;
    }
    if (isAuth()) {
      if (login) login.hidden = true;
      if (app) app.hidden = false;
      if (topR) topR.hidden = false;
    } else {
      if (login) login.hidden = false;
      if (app) app.hidden = true;
      if (topR) topR.hidden = true;
    }
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        const v = document.getElementById('pass').value.trim();
        const stored = getPasscode();
        if (!stored) {
          if (v.length < 8) { err.textContent = 'Minimum 8 characters.'; return; }
          setPasscode(v); setAuth(true); initView();
        } else {
          if (v === stored) { setAuth(true); initView(); }
          else { err.textContent = 'Incorrect passcode.'; }
        }
      };
    }
    const logout = document.getElementById('logout');
    if (logout) logout.onclick = function() { setAuth(false); initView(); };
  }
  document.addEventListener('DOMContentLoaded', initView);
})();