const validMethods = ['signInWithRedirect', 'signInWithPopup'];

const signIn = (auth, provider, options = {}) => {
  const { method = 'signInWithRedirect' } = options;

  if (validMethods.includes(method)) {
    return provider.isOAuthProvider
      ? auth[method](provider)
      : auth.signInAnonymously();
  }
  throw new Error('Invalid signIn method.');
};
export default signIn;
