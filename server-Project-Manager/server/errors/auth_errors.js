const handleSignInError = (error) => {
  let errorObject;

  if (error.message && error.message === 'email') {
    errorObject = {
      code: 'UnknownEmail',
      message: 'Unknown Email',
    };
  } else if (error.message && error.message === 'password') {
    errorObject = {
      code: 'WrongPassword',
      message: 'Wrong Password'
    };
  } else {
    errorObject = {
      code: 'UnkownError',
      message: 'Unknown Error'
    };
  }
  return errorObject;
};

const handleSignUpError = (error) => {
  let errorObject;

  if (error.errors && error.errors.email
    && error.errors.email.kind === 'unique'
    && error.errors.email.path === 'email') {
    errorObject = {
      code: 'MultipleEmails',
      message: 'This email is already registered'
    };
  } else {
    errorObject = {
      code: 'UnkownError',
      message: 'Unknown Error'
    };
  }
  return errorObject;
};

module.exports = {
  handleSignInError,
  handleSignUpError
};
