import { useState, useEffect } from 'react';

import createUser from './utils/createUser';

const defaultSession = { isSignedIn: false, user: {} };

const useAuth = (app) => {
  const [session, setSession] = useState(defaultSession);

  useEffect(
    () => app.auth().onAuthStateChanged((_user) => {
      const isSignedIn = !!_user;
      const user = isSignedIn ? createUser(_user) : {};
      setSession({ isSignedIn, user, _user });
    }),
    [app, setSession]
  );

  return session;
};

export default useAuth;
