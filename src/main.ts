// src/main.ts
import { initTitleUppercase } from './modules/title-uppercase';
import { initHitokoto } from './modules/hitokoto';

let lastUrl = location.href;
let navTimer: number | null = null;

function initAll() {
  if (window.location.port !== '10999') {
    return;
  }

  initTitleUppercase();

  if (window.location.pathname === '/') {
    initHitokoto();
  }
}

function initAllIfUrlChanged() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    initAll();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lastUrl = location.href;
    initAll();
  });
} else {
  lastUrl = location.href;
  initAll();
}

const observer = new MutationObserver(() => {
  console.log('Found')
  if (navTimer) clearTimeout(navTimer);
  navTimer = window.setTimeout(initAllIfUrlChanged, 100);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
});

// 保留 popstate 作为后备（虽然可能不触发，但无害）
window.addEventListener('popstate', () => {
  initAllIfUrlChanged();
});