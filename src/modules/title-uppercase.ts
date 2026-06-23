// src/modules/title-uppercase.ts

import { waitForElement } from '../utils/dom';

function applyTitleUppercase() {
  const title = document.title;
  if (/nflsoj/i.test(title)) {
    document.title = title.replace(/nflsoj/gi, 'NFLSOJ');
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
}