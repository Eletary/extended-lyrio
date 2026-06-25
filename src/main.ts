// src/main.ts
import { initTitleUppercase } from './modules/title-uppercase';
import { initHitokoto } from './modules/hitokoto';
import { initCopy } from './modules/copy';

let lastUrl = location.href;
let navTimer: number | null = null;
let titlePollTimer: number | null = null;

function initAll() {
  if (window.location.port !== '10999') {
    return;
  }

  initTitleUppercase();
  initCopy();
  if (window.location.pathname === '/') {
    initHitokoto();
  }
}

function initAllWithTries() {
  if (titlePollTimer) {
    clearInterval(titlePollTimer);
    titlePollTimer = null;
  }

  let attempts = 0;
  const maxAttempts = 6; // 6 * 500ms = 3s

  titlePollTimer = window.setInterval(() => {
    attempts++;
    initAll();
    if (attempts >= maxAttempts) {
      clearInterval(titlePollTimer!);
      titlePollTimer = null;
    }
  }, 500)
}

function initAllIfUrlChanged() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    initAllWithTries();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lastUrl = location.href;
    initAllWithTries();
  });
} else {
  lastUrl = location.href;
  initAllWithTries();
}

const observer = new MutationObserver(() => {
  console.log('[extended-lyrio] Content updated')
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