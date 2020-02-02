const handleFileUploadError = (error) => {
  let errorObject;

  if (error.message && error.message === 'email') {
    errorObject = {
      code: 'UnknownEmail',
      message: 'Unknown Email'
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


module.exports = {
  handleFileUploadError
};
