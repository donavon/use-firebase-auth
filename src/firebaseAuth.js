import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useFirebaseApp as useFirebaseApp_ } from '@use-firebase/app';
import useAuth from './useAuth';

const FirebaseAuthContext = React.createContext();
const providerSignature = Symbol();

const FirebaseAuthProvider = ({ children, useFirebaseApp }) => {
  const app = useFirebaseApp();
  const session = useAuth(app);

  const payload = useMemo(() => ({ signature: providerSignature, session }), [
    session,
  ]);

  return (
    <FirebaseAuthContext.Provider value={payload}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
FirebaseAuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
  useFirebaseApp: PropTypes.func,
};
FirebaseAuthProvider.defaultProps = {
  useFirebaseApp: useFirebaseApp_,
};

const useFirebaseAuth = () => {
  const { signature, session } = useContext(FirebaseAuthContext) || {};

  if (signature !== providerSignature) {
    throw new Error(
      'useFirebaseAuth must be a descendant of <FirebaseAuthProvider/>'
    );
  }
  return session;
};

export { FirebaseAuthProvider, useFirebaseAuth };
