import {signinToGithub, getCurrentUser, UserDetails} from './auth-controller';
import {logger} from '../utils/logger';
import { browser } from 'webextension-polyfill-ts';
import { getUrlsToPin, setUrlsToPin } from '../models/pinned-tabs';
import { updateAllWindows } from './window-controller';

function hideAllPages() {
  const pages = document.querySelectorAll('.page');
  for (const page of pages) {
    page.classList.add('is-hidden');
  }
}

function showPage(className: string) {
  hideAllPages();
  const page = document.querySelector(`.${className}`);
  page.classList.remove('is-hidden');
}

function showErrorPage(msg: string) {
  showPage('js-error');

  const errorMsg = document.querySelector('.js-error__msg');
  errorMsg.textContent = msg;
}

async function showOptionsPage(editMode = false) {
  let urlsToPin = await getUrlsToPin();
  const pinnedTabsList = document.querySelector('.js-pinned-tabs');
  while (pinnedTabsList.firstChild) {
    pinnedTabsList.removeChild(pinnedTabsList.firstChild);
  }

  // In edit mode we need at least 1 li element to allow editing.
  if (editMode && urlsToPin.length === 0) {
    urlsToPin = ['https://......'];
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
          const parsedUrl = new URL(urlText);
          newUrls.push(parsedUrl.toString());
        } catch (err) {
          logger.warn('Found an invalid URL: ', urlText);
        }
      }

      await setUrlsToPin(newUrls);
      await updateAllWindows();

      showOptionsPage(false);
    });
    buttonControls.appendChild(saveBtn);

    pinnedTabsList.setAttribute('contenteditable', 'true');
  } else {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit URLs';
    editBtn.addEventListener('click', () => {
      showOptionsPage(true);
    });
    buttonControls.appendChild(editBtn);

    pinnedTabsList.removeAttribute('contenteditable');
  }

  showPage('js-options');
}

function showLoadingPage() {
  showPage('js-loading');
}

window.addEventListener('load', async () => {
  showOptionsPage();
});
