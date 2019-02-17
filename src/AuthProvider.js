import Enum from './utils/Enum';

const AuthProvider = Enum(
  'ANONYMOUS',
  'GITHUB',
  'GOOGLE',
  'FACEBOOK',
  'TWITTER',
  'UNKNOWN'
);

export default AuthProvider;
