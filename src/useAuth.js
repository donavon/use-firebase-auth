import {
  useState, useEffect, useMemo, useCallback,
} from 'react';

import createUser from './utils/createUser';
import _createAuthProvider from './createAuthProvider';
import _signIn from './signIn';
import _signOut from './signOut';

const defaultSession = { loading: true };

const useAuth = (app) => {
  const [session, setSession] = useState(defaultSession);

  const auth = useMemo(() => app.auth(), [app]);
  const signIn = useCallback((...args) => _signIn(auth, ...args), [auth]);
  const signOut = useCallback((...args) => _signOut(auth, ...args), [auth]);
  const createAuthProvider = useCallback((...args) => _createAuthProvider(app, ...args), [app]);

  useEffect(
    () => auth.onAuthStateChanged((_user) => {
      const isSignedIn = !!_user;
      const user = isSignedIn ? createUser(_user) : {};
      setSession({ isSignedIn, user, _user });
    }),
    [auth, setSession]
  );

  const results = useMemo(() => ({
    ...session,
    app,
    signIn,
    signOut,
    createAuthProvider,
  }), [session, app, signIn, signOut, createAuthProvider]);

  return results;
};

export default useAuth;
