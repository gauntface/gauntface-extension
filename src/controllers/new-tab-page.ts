import { browser } from "webextension-polyfill-ts";

import { redirectIfNeeded } from "./new-tab/_redirect-if-needed";

function hideAllPages() {
  const pages = document.querySelectorAll(".page");
  for (const page of pages) {
    page.classList.add("is-hidden");
  }
}

function showPage(className: string) {
  hideAllPages();
  const page = document.querySelector(`.${className}`);
  page.classList.remove("is-hidden");
}

function showLoadingPage() {
  showPage("js-loading");
}

async function initTabsPage() {
  await redirectIfNeeded();
}

window.addEventListener("load", async () => {
  showLoadingPage();
  await initTabsPage();
});
