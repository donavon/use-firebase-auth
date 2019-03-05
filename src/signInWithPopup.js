const signInWithPopup = (auth, provider) => (provider.isOAuthProvider
  ? auth.signInWithPopup(provider)
  : auth.signInAnonymously());

export default signInWithPopup;
