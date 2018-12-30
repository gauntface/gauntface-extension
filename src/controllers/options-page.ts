import './_sentry';
import {logger} from '../utils/_logger';
import { browser } from 'webextension-polyfill-ts';
import { initPinnedTabs } from './options/_pinned-tabs';
import { initPopupWindows } from './options/_popup-windows';

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

async function selectOptionsTab(tab: Element) {
  const optionsNav = document.querySelector('.js-options-nav');
  const selectedElements = optionsNav.querySelectorAll('li.is-selected');
  for (let i = 0; i < selectedElements.length; i++) {
    deselectOptionsTab(selectedElements.item(i));

  }
  tab.classList.add('is-selected');
  const contentId = tab.getAttribute('tab-content');
  const contentElement = document.querySelector(`#${contentId}`);
  contentElement.classList.add('is-selected');
}

function deselectOptionsTab(tab: Element) {
  tab.classList.remove('is-selected');
  const contentId = tab.getAttribute('tab-content');
  const contentElement = document.querySelector(`#${contentId}`);
  contentElement.classList.remove('is-selected');
}

async function showOptionsPage(editMode = false) {
  showPage('js-options');
}

async function initOptionsPage() {
  const optionsNav = document.querySelector('.js-options-nav');
  const navElements = optionsNav.querySelectorAll('li');

  // Select first tab
  selectOptionsTab(navElements.item(0));

  for (let i = 0; i < navElements.length; i++) {
    const navItem = navElements.item(i);
    navItem.addEventListener('click', () => {
      selectOptionsTab(navItem);
    });
  }

  await initPinnedTabs();
  await initPopupWindows();
}

function showLoadingPage() {
  showPage('js-loading');
}

window.addEventListener('load', async () => {
  showLoadingPage();
  await initOptionsPage();
  showOptionsPage();
});
