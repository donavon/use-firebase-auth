# @use-firebase/auth

A custom React Hook that provides a declarative interface for Firebase Auth.

[![npm version](https://badge.fury.io/js/%40use-firebase%2Fauth.svg)](https://badge.fury.io/js/%40use-firebase%2Fauth)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

<div>
<img 
  src="https://user-images.githubusercontent.com/887639/54039469-031ff480-4191-11e9-8a9e-8ee846ef46f6.gif"
  alt="animated login with google"
  border="1"
  width="350"
  height="355"
>
</div>

## Installation

```bash
$ npm i @use-firebase/auth
```

or

```bash
$ yarn add @use-firebase/auth
```

## Usage

The Auth package requires that you install App as a dependency and that you wrap your App in both
`<FirebaseAppProvider>` and `<FirebaseAuthProvider>` as shown here.

```jsx
import React from 'react';
import { FirebaseAppProvider } from '@use-firebase/app';
import { FirebaseAuthProvider } from '@use-firebase/auth';

import App from './App';
import config from './data/firebaseConfig';

const FirebaseApp = () => (
  <FirebaseAppProvider config={config}>
    <FirebaseAuthProvider>
      <App />
    </FirebaseAuthProvider>
  </FirebaseAppProvider>
);

export default FirebaseApp;
```

This provides the global context that `useFirebaseAuth` needs. Now you can use `useFirebaseAuth`
anywhere in your App.

Initially, you will probably want to display either a Sign In screen if not signed in.
You can detect if you are signed in like this.

```jsx
import { useFirebaseAuth } from '@use-firebase/auth';

const App = () => {
  const { isSignedIn } = useFirebaseAuth();

  return (
    <div className="App">
      {isSignedIn ? <AuthenticatedApp /> : <NonAuthenticatedApp />}
    </div>
  );
};

export default App;
```

Here we either render the `AuthenticatedApp` or the `NonAuthenticatedApp` component.
The `NonAuthenticatedApp` would be where we render the sign in page.

Here's an example sign in page with a button that allows the user
to sign in with their Google credentials.

```jsx
import { useFirebaseAuth, AuthProvider } from '@use-firebase/auth';

const NonAuthenticatedApp = () => {
  const [message, setMesage] = useState('');
  const { signIn, createAuthProvider } = useFirebaseAuth();

  const signInWithRedirect = authProvider => {
    setMesage('');
    const provider = createAuthProvider(authProvider);
    signIn(provider).catch(error => {
      setMesage(error.message);
    });
  };

  return (
    <div>
      <h1>Please Sign In</h1>
      <p>
        <button onClick={() => signInWithRedirect(AuthProvider.GOOGLE)}>
          Sign In with Google
        </button>
      </p>
      {message && <div className="error-message">{message}</div>}
    </div>
  );
};
```

It redirects to the authentication page of the provider—Google in this case.
After the user is authenticated, you will be redirected back to your app where
`isSignedIn` will be `true` and the `AuthenticatedApp` component will be rendered.

Here is a sample `AuthenticatedApp` component.

```jsx
import { useFirebaseAuth } from '@use-firebase/auth';

const AuthenticatedApp = () => {
  const { user, signOut } = useFirebaseAuth();
  const { displayName, photoURL } = user;

  return (
    <div>
      <h1>Welcome {displayName}</h1>
      <div>
        <img className="avatar" alt={displayName} src={photoURL} />
      </div>
      <p>
        <button onClick={signOut}>Sign Out</button>
      </p>
    </div>
  );
};
```

You will note that it destructures two things from the call to `useFirebaseAuth`:
`user` (a user object) and `signOut` (a function to sign out).

## API

An import from `@use-firebase/auth` provides
`FirebaseAuthProvider`, `useFirebaseAuth`, and `AuthProvider`.

### FirebaseAuthProvider

You must wrap your `App` in `FirebaseAuthProvider` like this.

```jsx
<FirebaseAuthProvider>
  <App />
</FirebaseAuthProvider>
```

It provides context for `useFirebaseAuth`.

### useFirebaseAuth

`useFirebaseAuth` is a custom hook that returns a session object every time that the authentication
state changes.

A session object has the following properties.

| Parameter            | Description                                                                  |
| :------------------- | :--------------------------------------------------------------------------- |
| `loading`            | Set to `true` if the rest of the session properties are indeterminate.       |
| `isSignedIn`         | Set to `true` if the user is signed in.                                      |
| `user`               | A `user` object if signed in, otherwise an empty object. See below.                                                    |
| `createAuthProvider` | A function that returns a `provider` instance given an enum `AuthProvider` value. |
| `signIn`             | A function that will take the user on the sign in journey. If successful, `isSignedIn` will be to `false`. See below for details.        |
| `signOut`            | A function that will sign the user out. If successful, `isSignedIn` will be to `false`.      |

#### user

`user` is a user object with the following properties.

| Parameter       | Description                                                                                                    |
| :-------------- | :------------------------------------------------------------------------------------------------------------- |
| `uid`           | A unique identifier for the user.                                                                              |
| `displayName`   | The user's full name.                                                                                          |
| `photoURL`      | A URL to the user's image. May not be included for all providers.                                              |
| `email`         | The user's email address. May not be included for all providers.                                               |
| `emailVerified` | `true` if the email is verified.                                                                               |
| `isAnonymous`   | `true` if the authenticaion method is anonymous. WIll be `false` if you used a provider other than `ANONYMOUS` |
| `phoneNumber`   | The user's phone number. May not be included for all providers.                                                |

#### createAuthProvider

Call `createAuthProvider` with one of the `AuthProvider` enum values.
It returns a `provider` instance that you can pass to `signIn`
See the [Firebase documentation](https://firebase.google.com/docs/reference/js/firebase.auth.AuthProvider)
for more information.

#### signIn

Call `signIn` with an `provider` instance and an optional `options` object.

The `options` object has a single key of `method`. `method` is a string with either
`signInWithRedirect` or `signInWithPopup`. The default is `signInWithRedirect`.

`signIn` returns a promise that will resolve upon a successful sign in (if using a popup)
or reject if a sign in could not be performed.

For example, here is a simple `SignIn` component that allows the user to
sign in using their Google credentials.

```js
import { useFirebaseAuth, AuthProvider } from '@use-firebase/auth';

const SignIn = () => {
  const { signIn, createAuthProvider } = useFirebaseAuth();
  const googleProvider = createAuthProvider(AuthProvider.GOOGLE);

  return (
    <button onClick={() => signIn(googleProvider)}>Sign In with Google</button>
  );
};
```

#### signOut

Call `signOut` to sign the user out.

It returns a promise that will resolve upon a successful sign out
or reject if a sign out could not be performed.

### AuthProvider

`AuthProvider` is an enum with the following values.

| Parameter   | Description                   |
| :---------- | :---------------------------- |
| `ANONYMOUS` | No credentials required.      |
| `GITHUB`    | Authenticate against GitHub   |
| `GOOGLE`    | Authenticate against Google.  |
| `FACEBOOK`  | Authenticate against Facebook |
| `TWITTER`   | Authenticate against Twitter  |

## Live demo

You can run the sign in demo on CodeSandbox where you can
see all of the code above. Fork it, change the `config` data
to point to your Firebase project, and make your own app.

[![Edit simple use-firebase/auth demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jjjqrm6q85?fontsize=14)

## License

**[MIT](LICENSE)** Licensed
