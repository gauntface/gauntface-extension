import { browser } from "webextension-polyfill-ts";
import { configurePanels } from "./_panels";
import { updateAllWindows } from "./_window-controller";
import { configurePinnedTabs } from "./_pinned-tabs";

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

async function initPopupPage() {
  const optionsBtn = document.querySelector(".js-options-btn");
  const pinnedTabsBtn = document.querySelector(".js-update-pinned-tabs");
  const popupWindowBtn = document.querySelector(".js-update-popup-windows");
  pinnedTabsBtn.addEventListener("click", async () => {
    const window = await browser.windows.getCurrent();
    await browser.runtime.sendMessage({
      type: "update-pinned-tabs",
      data: {
        windowID: window.id,
      },
    });
  });
  popupWindowBtn.addEventListener("click", async () => {
    await configurePanels();
  });
  optionsBtn.addEventListener("click", async () => {
    await browser.runtime.openOptionsPage();
  });
}

function showPopupPage() {
  showPage("js-popup");
}

window.addEventListener("load", async () => {
  showLoadingPage();
  await initPopupPage();
  showPopupPage();
});
