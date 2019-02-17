import AuthProvider from './AuthProvider';

const mapAuthProviderToMethod = {
  [AuthProvider.GITHUB]: 'GithubAuthProvider',
  [AuthProvider.GOOGLE]: 'GoogleAuthProvider',
  [AuthProvider.FACEBOOK]: 'FacebookAuthProvider',
  [AuthProvider.TWITTER]: 'TwitterAuthProvider',
};

const createAuthProvider = (app, authProvider) => {
  const method = mapAuthProviderToMethod[authProvider];
  // eslint-disable-next-line no-underscore-dangle
  return method ? new app.firebase_.auth[method]() : {};
};

export default createAuthProvider;
