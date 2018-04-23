import * as firebase from 'firebase';

// This class represents the "Application". It essentially
// acts as a single place to store shared information.
export class Application {
  private firebaseApp: firebase.app.App | null;

  constructor() {
    this.firebaseApp = null;
    // this.initFirebase();
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