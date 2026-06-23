// src/modules/title-uppercase.ts

import { waitForElement } from '../utils/dom';

let lastTitle = '';
let pollingTimer: number | null = null;

function applyTitleUppercase() {
  const title = document.title;

  if (title !== lastTitle && /nflsoj/i.test(title)) {
    const newTitle = title.replace(/nflsoj/gi, 'NFLSOJ');
    if (newTitle !== title) {
      document.title = newTitle;
    }
    lastTitle = newTitle;
  } else {
    lastTitle = title;
  }
}

export async function applyHeaderUppercase() {
  const header = await waitForElement('._siteName_s0m91_14');
  if (header) {
    const text = header.textContent;
    if (text && /nflsoj/i.test(text)) {
      header.textContent = text.replace(/nflsoj/gi, 'NFLSOJ');
    }
  }
}

export function initTitleUppercase(): void {
  applyTitleUppercase();
  applyHeaderUppercase();

  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }

  pollingTimer = window.setInterval(() => {
    applyTitleUppercase();
  }, 500);
}