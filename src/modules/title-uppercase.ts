// src/modules/title-uppercase.ts

import { waitForElement, waitForElementAll } from '../utils/dom';

function applyTitleUppercase(): void {
  const title = document.title;
  if (/nflsoj/i.test(title)) {
    document.title = title.replace(/nflsoj/gi, 'NFLSOJ');
  }
}

export async function applyHeaderUppercase(): Promise<void> {
  const header = await waitForElement('._siteName_s0m91_14');
  if (header) {
    const text = header.textContent;
    if (text && /nflsoj/i.test(text)) {
      header.textContent = text.replace(/nflsoj/gi, 'NFLSOJ');
    }
  }
  const footer = await waitForElement('._footer_s0m91_137');
  if (footer) {
    let div = footer?.firstChild?.firstChild;
    if (!div) return;
    const text = div.textContent;
    if (text && /nflsoj/i.test(text)) {
      div.textContent = text.replace(/nflsoj/gi, 'NFLSOJ');
    }
  }
}

function replaceTextInNode(node: Node, regex: RegExp, replacement: string): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (text && regex.test(text)) {
      node.textContent = text.replace(regex, replacement);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      replaceTextInNode(child, regex, replacement);
    }
  }
}

export async function applyAnswerUppercase(): Promise<void> {
  const columns = await waitForElementAll('._columnAnswer_1yoe4_7');
  const regex = /c\+\+/gi;
  const replacement = 'C++';

  columns.forEach(col => {
    const firstChild = col.firstElementChild;
    if (firstChild) {
      replaceTextInNode(firstChild, regex, replacement);
    }
  });
}

export function initTitleUppercase(): void {
  applyHeaderUppercase();
  applyAnswerUppercase();
  applyTitleUppercase();
}