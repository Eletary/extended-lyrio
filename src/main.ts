// src/main.ts
import { initTitleUppercase } from './modules/title-uppercase';
import { initHitokoto } from './modules/hitokoto';

function main() {
  if (window.location.port !== '10999') {
    return;
  }
  const path = window.location.pathname;
  initTitleUppercase();
  if (path === '/') {
    initHitokoto();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}