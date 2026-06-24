// src/utils/dom.ts

export function waitForElement(selector: string, timeout = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
    }, timeout);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export function waitForElementAll(selector: string, timeout = 10000): Promise<Element[]> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelectorAll(selector);
    if (existing.length > 0) {
      resolve(Array.from(existing));
      return;
    }

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
    }, timeout);

    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(Array.from(elements));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}