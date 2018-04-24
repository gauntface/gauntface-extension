import {signinToGithub, getCurrentUser, UserDetails} from './auth-controller';
import {logger} from '../utils/logger';

function hideAllPages() {
  const pages = document.querySelectorAll('.page');
  for (const page of pages) {
    page.classList.add('is-hidden');
  }
}

function showErrorPage(msg: string) {
  hideAllPages();
  const errorPage = document.querySelector('.js-error');
  errorPage.classList.remove('is-hidden');

  const errorMsg = document.querySelector('.js-error__msg');
  errorMsg.textContent = msg;
}

function showOptionsPage(user: UserDetails) {
  hideAllPages();

  const optionsPage = document.querySelector('.js-options');
  optionsPage.classList.remove('is-hidden');
}

window.addEventListener('load', async () => {
  let currentUser = null;
  try {
    currentUser = await signinToGithub();
  } catch (err) {
    logger.error(`Unable to sign in.`, err);
    return showErrorPage(err.message);
  }

  if (!currentUser) {
    return showErrorPage('Unable to get user info');
  }

  showOptionsPage(currentUser);
});