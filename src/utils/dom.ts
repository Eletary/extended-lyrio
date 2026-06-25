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


let modalCounter = 0;

export function promptContent(title: string, content: string): HTMLElement {
  const id = `modal-${++modalCounter}`;

  if (!document.getElementById('nflsoj-modal-keyframes')) {
    const style = document.createElement('style');
    style.id = 'nflsoj-modal-keyframes';
    style.textContent = `
      @keyframes nflsoj-modal-popup {
        0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
      @keyframes nflsoj-modal-popout {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const modal = document.createElement('div');
  modal.className = 'ui modal';
  modal.id = id;
  modal.style.cssText = `
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
    background: #fff;
    border-radius: 0.28571429rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    padding: 0;
    animation: nflsoj-modal-popup 0.3s ease-out;
  `;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  const header = document.createElement('div');
  header.className = 'header';
  header.textContent = title;
  header.style.cssText = `
    padding: 15px 20px;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  `;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';
  contentDiv.innerHTML = content;
  contentDiv.style.cssText = `
    padding: 20px;
    overflow-y: auto;
    max-height: 60vh;
  `;

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.style.cssText = `
    padding: 10px 20px;
    border-top: 1px solid #ddd;
    text-align: right;
  `;

  const confirmBtn = document.createElement('div');
  confirmBtn.className = 'ui positive button';
  confirmBtn.textContent = 'OK';
  confirmBtn.style.cursor = 'pointer';

  actions.appendChild(confirmBtn);
  modal.append(header, contentDiv, actions);
  document.body.appendChild(modal);

  const closeModal = () => {
    modal.style.animation = 'nflsoj-modal-popout 0.3s ease-in forwards';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      modal.remove();
      overlay.remove();
    }, 300);
  };

  confirmBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  return modal;
}