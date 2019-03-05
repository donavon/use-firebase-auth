import { testHook, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import useAuth from '../src/useAuth';

afterEach(cleanup);

const createMockApp = (handlers, uninitialize = () => {}) => ({
  auth: () => ({
    onAuthStateChanged: (cb) => {
      handlers.push(cb);
      return uninitialize;
    },
  }),
});

describe('useAuth', () => {
  test('initially returns loading=`true` until an event fires', () => {
    const handlers = [];
    const mockApp = createMockApp(handlers);

    let value;
    testHook(() => {
      value = useAuth(mockApp);
    });

    expect(handlers.length).toBe(1);
    expect(value.loading).toBe(true);
  });

  test('cleans up on unmount', () => {
    const handlers = [];
    const uninitialize = jest.fn();
    const mockApp = createMockApp(handlers, uninitialize);

    const { unmount } = testHook(() => {
      useAuth(mockApp);
    });

    unmount();

    expect(handlers.length).toBe(1);
    expect(uninitialize).toHaveBeenCalled();
  });

  test('if `app` changes, listeners will `off` and back `on`', () => {
    const handlers1 = [];
    const mockApp1 = createMockApp(handlers1);
    const handlers2 = [];
    const mockApp2 = createMockApp(handlers2);

    let app = mockApp1;
    const { rerender } = testHook(() => {
      useAuth(app);
    });

    app = mockApp2;
    rerender();

    expect(handlers2.length).toBe(1);
  });

  test('returns the `session` object with {isSignedIn: true, user} when signed in', () => {
    const handlers = [];
    const uninitialize = jest.fn();
    const mockApp = createMockApp(handlers, uninitialize);

    let value;
    testHook(() => {
      value = useAuth(mockApp);
    });

    const user = {
      uid: '123',
      displayName: 'Bob',
      email: 'email@example.com',
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: '202-555-1212',
      photoURL: 'http://example.com/image.png',
    };

    const eventUser = {
      ...user,
      metadata: {
        creationTime: '1970-01-01T00:00:00.000Z',
        lastSignInTime: '1970-01-01T00:00:00.000Z',
      },
      providerData: [
        {
          providerId: 'google.com',
        },
      ],
    };

    handlers[0](eventUser);

    expect(value.isSignedIn).toBe(true);
    expect(value.user).toEqual({
      ...user,
      authProvider: 'GOOGLE',
      creationTime: new Date(0),
      lastSignInTime: new Date(0),
    });
  });

  test('returns the new value with {isSignedIn: false} on sign out', () => {
    const handlers = [];
    const uninitialize = jest.fn();
    const mockApp = createMockApp(handlers, uninitialize);

    let value;
    testHook(() => {
      value = useAuth(mockApp);
    });

    const eventUser = null;

    handlers[0](eventUser);

    expect(value.isSignedIn).toBe(false);
    expect(value.user).toEqual({});
  });
});
