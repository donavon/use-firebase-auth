const signInWithPopup = (app, provider) => (provider.isOAuthProvider
  ? app.auth().signInWithPopup(provider)
  : app.auth().signInAnonymously());

export default signInWithPopup;
