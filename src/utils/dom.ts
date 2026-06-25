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

  // 创建模态框容器
  const modal = document.createElement('div');
  modal.className = 'ui modal';
  modal.id = id;
  modal.style.display = 'block'; // 默认显示（会由 Semantic UI 控制，但我们手动显示）

  // 标题
  const header = document.createElement('div');
  header.className = 'header';
  header.textContent = title;

  // 内容
  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';
  contentDiv.innerHTML = content;

  // 操作按钮
  const actions = document.createElement('div');
  actions.className = 'actions';

  const confirmBtn = document.createElement('div');
  confirmBtn.className = 'ui positive button';
  confirmBtn.textContent = '确定';

  actions.appendChild(confirmBtn);
  modal.append(header, contentDiv, actions);

  document.body.appendChild(modal);

  modal.style.display = 'block';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.zIndex = '10000';
  modal.style.maxWidth = '80%';
  modal.style.maxHeight = '80%';
  modal.style.overflow = 'auto';
  modal.style.background = '#fff';
  modal.style.borderRadius = '0.28571429rem';
  modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  modal.style.padding = '0';

  // 添加灰色背景遮罩
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  // 点击确定关闭
  confirmBtn.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });

  // 点击遮罩关闭（可选）
  overlay.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });

  return modal;
}