import * as firebase from 'firebase';
import { browser } from 'webextension-polyfill-ts';
import {onInstalled} from './lifecycle-controller';
import {onWindowCreated, onWindowRemoved} from './window-controller';

// This class represents the "Application". It essentially
// acts as a single place to store shared information.
export class Application {
  private firebaseApp: firebase.app.App;

  constructor() {
    this.firebaseApp = null;
    this.setupEventListeners();
    this.initFirebase();
  }

  private setupEventListeners() {
    browser.windows.onCreated.addListener(onWindowCreated);
    browser.windows.onRemoved.addListener(onWindowRemoved);
    browser.runtime.onInstalled.addListener(onInstalled);
  }

  private initFirebase() {
    const config = {
      apiKey: "AIzaSyBcRNFzlJbtmQ7W-z1m-pPPt_0XYpE3ZN4",
      authDomain: "gauntface-extension.firebaseapp.com",
      databaseURL: "https://gauntface-extension.firebaseio.com",
      projectId: "gauntface-extension",
      storageBucket: "gauntface-extension.appspot.com",
    };
    this.firebaseApp = firebase.initializeApp(config);
  }

  get firebase(): firebase.app.App {
    return this.firebaseApp;
  }
}

export const application = new Application();