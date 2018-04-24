import * as firebase from 'firebase';
import { browser } from 'webextension-polyfill-ts';
import { Application } from './application';

export interface UserDetails {
  displayName: string;
  photoURL: string;
  uid: string;
}

export async function getCurrentUser(): Promise<UserDetails|null> {
  const application = ((await browser.runtime.getBackgroundPage()) as any) as Application;
  const user = application.firebase.auth().currentUser;

  if (user) {
    return {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    };
  }

  return null;
}

export async function signinToGithub(): Promise<UserDetails> {
  // tslint:disable-next-line:no-any
  const application = ((await browser.runtime.getBackgroundPage()) as any) as Application;
  const provider = new firebase.auth.GithubAuthProvider();
  const result = await application.firebase.auth().signInWithPopup(provider);

  const currentUser = {
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };

  return currentUser;
}
