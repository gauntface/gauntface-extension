import { getPopupURLs, setPopupURLs } from "../../models/_popup-urls";
import { logger } from "../../utils/_logger";

const DEFAULT_TEXT = "https://......";

export async function initPopupWindows(editMode = false) {
  let urlsToPin = await getPopupURLs();

  const tabsList = document.querySelector(".js-popup-window-urls");
  while (tabsList.firstChild) {
    tabsList.removeChild(tabsList.firstChild);
  }

  // In edit mode we need at least 1 li element to allow editing.
  if (editMode && urlsToPin.length === 0) {
    urlsToPin = [DEFAULT_TEXT];
  }

  for (const url of urlsToPin) {
    const listItem = document.createElement("li");
    listItem.textContent = url;
    tabsList.appendChild(listItem);
  }

  const buttonControls = document.querySelector(
    ".js-popup-window-urls-controls"
  );
  while (buttonControls.firstChild) {
    buttonControls.removeChild(buttonControls.firstChild);
  }

  if (editMode) {
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", async () => {
      saveBtn.disabled = true;
      const newUrls = [];
      const listItems = tabsList.querySelectorAll("li");
      for (const item of listItems) {
        const urlText = item.textContent;
        try {
          if (urlText.length === 0 || urlText === DEFAULT_TEXT) {
            continue;
          }

          const parsedUrl = new URL(urlText);
          newUrls.push(parsedUrl.toString());
        } catch (err) {
          logger.warn("Found an invalid URL: ", urlText);
        }
      }

      await setPopupURLs(newUrls);

      initPopupWindows(false);
    });
    buttonControls.appendChild(saveBtn);

    tabsList.setAttribute("contenteditable", "true");
  } else {
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit URLs";
    editBtn.addEventListener("click", () => {
      initPopupWindows(true);
    });
    buttonControls.appendChild(editBtn);

    tabsList.removeAttribute("contenteditable");
  }
}
