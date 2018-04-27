import {logger} from '../../utils/logger';
import { getUrlsToPin, setUrlsToPin } from '../../models/pinned-tabs';
import { updateAllWindows } from '../window-controller';

const DEFAULT_TEXT = 'https://......';

export async function initPinnedTabs(editMode = false) {
  let urlsToPin = await getUrlsToPin();
  const pinnedTabsList = document.querySelector('.js-pinned-tabs');
  while (pinnedTabsList.firstChild) {
    pinnedTabsList.removeChild(pinnedTabsList.firstChild);
  }

  // In edit mode we need at least 1 li element to allow editing.
  if (editMode && urlsToPin.length === 0) {
    urlsToPin = [DEFAULT_TEXT];
  }

  for (const url of urlsToPin) {
    const listItem = document.createElement('li');
    listItem.textContent = url;
    pinnedTabsList.appendChild(listItem);
  }

  const buttonControls = document.querySelector('.js-pinned-tabs-controls');
  while (buttonControls.firstChild) {
    buttonControls.removeChild(buttonControls.firstChild);
  }

  if (editMode) {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      const newUrls = [];
      const listItems = pinnedTabsList.querySelectorAll('li');
      for (const item of listItems) {
        const urlText = item.textContent;
        try {
          if (urlText.length === 0 || urlText === DEFAULT_TEXT) {
            continue;
          }

          const parsedUrl = new URL(urlText);
          newUrls.push(parsedUrl.toString());
        } catch (err) {
          logger.warn('Found an invalid URL: ', urlText);
        }
      }

      await setUrlsToPin(newUrls);
      await updateAllWindows();

      initPinnedTabs(false);
    });
    buttonControls.appendChild(saveBtn);

    pinnedTabsList.setAttribute('contenteditable', 'true');
  } else {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit URLs';
    editBtn.addEventListener('click', () => {
      initPinnedTabs(true);
    });
    buttonControls.appendChild(editBtn);

    pinnedTabsList.removeAttribute('contenteditable');
  }
}
