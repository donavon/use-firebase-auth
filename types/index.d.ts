import firebase from 'firebase'
declare module '@use-firebase/auth' {
  /**
   * A custom React Hook that provides a declarative useAuth..
   */
  export default function useAuth(
    app: firebase
  ): void;
}
