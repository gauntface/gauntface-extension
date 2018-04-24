import * as firebase from 'firebase';
import { browser } from 'webextension-polyfill-ts';
import {application} from './application';

export interface UserDetails {
  displayName: string,
  photoURL: string,
  uid: string,
};

export async function getCurrentUser(): Promise<UserDetails|null> {
  const storageResult = await browser.storage.sync.get('currentUser');
  
  if (storageResult && storageResult.currentUser) {
    const currentUser = storageResult.currentUser as UserDetails;
    return currentUser;
  }

  return null;
}

export async function signinToGithub(): Promise<UserDetails> {
  const provider = new firebase.auth.GithubAuthProvider();
  const result = await application.firebase.auth().signInWithPopup(provider);

  const currentUser = {
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };

  await browser.storage.sync.set({currentUser});

  return currentUser;
}