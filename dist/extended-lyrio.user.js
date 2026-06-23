// ==UserScript==
// @name         extended-lyrio
// @namespace    https://github.com/Eletary/extended-lyrio
// @version      0.1.0
// @author       Your Name
// @description  Modern Lyrio enhancer
// @license      ISC
// @homepage     https://github.com/Eletary/extended-lyrio
// @homepageURL  https://github.com/Eletary/extended-lyrio
// @source       https://github.com/Eletary/extended-lyrio.git
// @supportURL   https://github.com/Eletary/extended-lyrio/issues
// @match        *://nflsoi.cc/*
// @match        *://www.nflsoi.cc/*
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// ==/UserScript==

(function() {
	"use strict";
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	function waitForElement(selector, timeout = 1e4) {
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
				subtree: true
			});
		});
	}
	var init_dom = __esmMin((() => {}));
	function applyTitleUppercase() {
		const title = document.title;
		if (title !== lastTitle && /nflsoj/i.test(title)) {
			const newTitle = title.replace(/nflsoj/gi, "NFLSOJ");
			if (newTitle !== title) document.title = newTitle;
			lastTitle = newTitle;
		} else lastTitle = title;
	}
	async function applyHeaderUppercase() {
		const header = await waitForElement("._siteName_s0m91_14");
		if (header) {
			const text = header.textContent;
			if (text && /nflsoj/i.test(text)) header.textContent = text.replace(/nflsoj/gi, "NFLSOJ");
		}
	}
	function initTitleUppercase() {
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
	var lastTitle, pollingTimer;
	var init_title_uppercase = __esmMin((() => {
		init_dom();
		lastTitle = "";
		pollingTimer = null;
	}));
	async function fetchHitokoto() {
		const data = await (await fetch(config.api)).json();
		return `${data.hitokoto}
          <div style="margin-top: 14px; text-align: right; font-size: .95em; color: #999;">
            —— ${data.from}
          </div>`;
	}
	async function initHitokoto() {
		try {
			const sidebar = await waitForElement(config.sidebarSelector);
			if (sidebar.querySelector(".hitokoto-module")) return;
			sidebar.insertAdjacentHTML("afterbegin", `
      <div class="hitokoto-module" style="margin-bottom: 1em;">
        <style>
          #hitokoto-skeleton.ui.placeholder,
          #hitokoto-skeleton.ui.placeholder::before,
          #hitokoto-skeleton .image.header::after,
          #hitokoto-skeleton .line,
          #hitokoto-skeleton .line::after,
          #hitokoto-skeleton > ::before {
            background-color: var(--theme-background, #fff) !important;
          }
          #hitokoto-skeleton {
            min-height: 60px;
            margin-top: 0.3em;
          }
        </style>
        <h4 class="ui block top attached header _header_1efka_1">
          <i aria-hidden="true" class="ui quote left icon"></i>
          <div class="content">
            Hitokoto (ヒトコト)
            <i id="refresh-hitokoto" title="Refresh" class="redo icon button" style="
              opacity: .2;
              position: absolute;
              right: 20px;
              height: 19px;
              display: inline-flex;
              align-items: center;
              cursor: pointer;
            "></i>
          </div>
        </h4>
        <div class="ui bottom attached center aligned segment">
          <div id="hitokoto-text" style="display: none;"></div>
          <div id="hitokoto-skeleton" class="ui placeholder">
            <div class="paragraph">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
    `);
			const moduleEl = sidebar.querySelector(".hitokoto-module");
			const textDisplay = moduleEl.querySelector("#hitokoto-text");
			const skeleton = moduleEl.querySelector("#hitokoto-skeleton");
			const refreshBtn = moduleEl.querySelector("#refresh-hitokoto");
			async function loadHitokoto() {
				textDisplay.style.display = "none";
				skeleton.style.display = "";
				try {
					textDisplay.innerHTML = await fetchHitokoto();
					textDisplay.style.display = "";
					skeleton.style.display = "none";
				} catch (error) {
					textDisplay.innerHTML = "<p>一言加载失败，请稍后重试</p>";
					textDisplay.style.display = "";
					skeleton.style.display = "none";
					console.error("[Hitokoto]", error);
				}
			}
			refreshBtn.addEventListener("click", loadHitokoto);
			await loadHitokoto();
			refreshBtn.addEventListener("mouseenter", () => refreshBtn.style.opacity = ".4");
			refreshBtn.addEventListener("mouseleave", () => refreshBtn.style.opacity = ".2");
		} catch (error) {
			console.warn("[Hitokoto]", error);
		}
	}
	var config;
	var init_hitokoto = __esmMin((() => {
		init_dom();
		config = {
			api: "https://v1.hitokoto.cn/?c=a",
			sidebarSelector: ".five.wide.column"
		};
	}));
	__commonJSMin((() => {
		init_title_uppercase();
		init_hitokoto();
		function main() {
			if (window.location.port !== "10999") return;
			const path = window.location.pathname;
			initTitleUppercase();
			if (path === "/") initHitokoto();
		}
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
		else main();
	}))();
})();
