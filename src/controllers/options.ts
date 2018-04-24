import {signinToGithub, getCurrentUser, UserDetails} from './auth-controller';
import {logger} from '../utils/logger';

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

function showOptionsPage(user: UserDetails) {
  showPage('js-options');
}

function showLoadingPage() {
  showPage('js-loading');
}

function showSignInPage() {
  showPage('js-sign-in');

  const signinBtn = document.querySelector('.js-sign-in-btn');
  signinBtn.removeAttribute('disabled');
}

async function signinUser() {
  const signinBtn = document.querySelector('.js-sign-in-btn');
  try {
    showLoadingPage();

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
  } catch (err) {

  } finally {
    signinBtn.removeAttribute('disabled');
  }
}

window.addEventListener('load', async () => {
  const signinBtn = document.querySelector('.js-sign-in-btn');
  signinBtn.setAttribute('disabled', 'true');
  signinBtn.addEventListener('click', signinUser);

  const currentUser = await getCurrentUser();
  if (currentUser) {
    showOptionsPage({
      displayName: 'Test Name',
      photoURL: '',
      uid: '1234',
    });
  } else {
    showSignInPage();
  }
});
