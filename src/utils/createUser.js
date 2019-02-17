import AuthProvider from '../AuthProvider';

const providerIdToAuthProvider = {
  anonymous: AuthProvider.ANONYMOUS,
  'github.com': AuthProvider.GITHUB,
  'google.com': AuthProvider.GOOGLE,
  'facebook.com': AuthProvider.FACEBOOK,
  'twitter.com': AuthProvider.TWITTER,
};

const userKeys = 'displayName,email,emailVerified,isAnonymous,phoneNumber,photoURL,uid'.split(
  ','
);

const createUser = (_user) => {
  const user = userKeys.reduce(
    (prev, key) => ({
      ...prev,
      [key]: _user[key] === null ? undefined : _user[key],
    }),
    {}
  );
  const providerId = user.isAnonymous
    ? 'anonymous'
    : _user.providerData[0].providerId;

  user.authProvider = providerIdToAuthProvider[providerId] || AuthProvider.UNKNOWN;

  // Convert to Date objects
  const { creationTime, lastSignInTime } = _user.metadata;
  user.creationTime = new Date(creationTime);
  user.lastSignInTime = new Date(lastSignInTime);

  // Build a fake username
  if (!user.displayName) {
    user.displayName = `USER_${user.uid.substr(0, 6)}`;
  }

  return user;
};

export default createUser;
