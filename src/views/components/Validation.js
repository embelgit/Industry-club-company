export const validateUserName = (value, validateUserNameList) => {
  let error;
  if (validateUserNameList?.length) {
    const exists = validateUserNameList.some(username => username === value);
    if (exists) {
      error = 'UserName already exists';
    }
  }
  return error;
};

export const validateContact = (value, validateContactList) => {
  let error;
  if (validateContactList?.length) {
    const exists = validateContactList.some(contact => contact === value);
    if (exists) {
      error = 'Contact No already exists';
    }
  }
  return error;
};

export const validateEmail = (value, validateEmailList) => {
  let error;
  // Check if the email format is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    error = 'Invalid email address';
  }
  // Check if the email already exists in the list
  if (validateEmailList?.length) {
    const exists = validateEmailList.some(email => email === value);
    if (exists) {
      error = 'Email already registered';
    }
  }
  return error;
};

// GST Validation Function
export const validateGST = (value, gstList) => {
  let error;

  if (gstList?.length) {
    const exists = gstList.some(gst => gst === value);
    if (exists) {
      error = 'GST number already exists';
    }
  }

  return error;
};
