import { browser } from "webextension-polyfill-ts";

import { getUseCustomTabPage } from "../../models/_custom-new-tab-page";

export async function redirectIfNeeded() {
  const useCustomTab = await getUseCustomTabPage();
  if (!useCustomTab) {
    // This was a trick found on stackoverflow here:
    // https://stackoverflow.com/questions/30437737/programmatically-or-optionally-override-chromes-new-tab-page
    browser.tabs.update({
      url: "chrome-search://local-ntp/local-ntp.html",
    });
  }
}
