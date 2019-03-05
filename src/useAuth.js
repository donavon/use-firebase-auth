import {
  useState, useEffect, useMemo, useCallback,
} from 'react';

import createUser from './utils/createUser';
import _createAuthProvider from './createAuthProvider';
import _signInWithPopup from './signInWithPopup';

const defaultSession = { loading: true };

const useAuth = (app) => {
  const [session, setSession] = useState(defaultSession);

  const auth = useMemo(() => app.auth(), [app]);

  const signOut = useCallback(() => auth.signOut(), [auth]);

  const signIn = useCallback(provider => _signInWithPopup(auth, provider), [
    auth,
  ]);

  const createAuthProvider = useCallback(
    authProvider => _createAuthProvider(app, authProvider),
    [app]
  );

  useEffect(
    () => auth.onAuthStateChanged((_user) => {
      const isSignedIn = !!_user;
      const user = isSignedIn ? createUser(_user) : {};
      setSession({ isSignedIn, user, _user });
    }),
    [auth, setSession]
  );

  return {
    ...session,
    app,
    signIn,
    signOut,
    createAuthProvider,
  };
};

export default useAuth;
