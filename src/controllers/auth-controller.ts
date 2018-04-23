import * as firebase from 'firebase';
import {application} from '../application';

export async function signinToGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  const result = await application.firebase.auth().signInWithPopup(provider);
  console.log(result);
}