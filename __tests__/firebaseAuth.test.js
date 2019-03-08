import React from 'react';
import 'jest-dom/extend-expect';
import { render } from 'react-testing-library';

import { FirebaseAuthProvider, useFirebaseAuth } from '../src/firebaseAuth';

const createMockApp = (handlers, uninitialize = () => {}) => ({
  auth: () => ({
    onAuthStateChanged: (cb) => {
      handlers.push(cb);
      return uninitialize;
    },
    // eslint-disable-next-line prefer-promise-reject-errors
    getRedirectResult: () => Promise.reject('bad'),
  }),
});

const handlers = [];
const mockApp = createMockApp(handlers);
const useFirebaseApp = () => mockApp;

describe('useFirebaseAuth', () => {
  test('throws and exception if not a descendant of <FirebaseAuthProvider />', () => {
    const Component = () => {
      useFirebaseAuth();
      return null;
    };
    expect(() => render(<Component />)).toThrow();
  });

  test('returns a session object', () => {
    let session;
    const Component = () => {
      session = useFirebaseAuth();
      return null;
    };
    render(
      <FirebaseAuthProvider useFirebaseApp={useFirebaseApp}>
        <Component />
      </FirebaseAuthProvider>
    );

    expect(typeof session.createAuthProvider).toBe('function');
    expect(typeof session.signIn).toBe('function');
    expect(typeof session.signOut).toBe('function');
  });
});
