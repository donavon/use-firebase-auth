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
  const [signInError, setSignInError] = useState(null);

  const onSignInError = useCallback((error) => { setSignInError(error); }, [setSignInError]);
  const auth = useMemo(() => app.auth(), [app]);
  const signIn = useCallback(
    (...args) => {
      setSignInError(null);
      return _signIn(auth, ...args).catch(onSignInError);
    }, [auth, setSignInError, onSignInError]
  );
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

  useEffect(
    () => {
      auth.getRedirectResult().catch(onSignInError);
    },
    [auth, onSignInError]
  );

  const results = useMemo(() => ({
    ...session,
    signInError,
    app,
    signIn,
    signOut,
    createAuthProvider,
  }), [session, signInError, app, signIn, signOut, createAuthProvider]);

  return results;
};

export default useAuth;
