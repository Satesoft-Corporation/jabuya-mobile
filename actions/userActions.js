import * as actionTypes from "./actionTypes";

// auth actions
export const changeUser = (user) => {
  return {
    type: actionTypes.CHANGE_USER,
    payload: user,
  };
};

export const loginAction = (loginBool) => {
  return {
    type: actionTypes.LOGIN_ACTION,
    payload: loginBool,
  };
};

export const changeUserType = (type) => {
  return {
    type: actionTypes.CHANGE_USER_TYPE,
    payload: type,
  };
};

export const setUserPinCode = (code) => {
  return {
    type: actionTypes.SET_USER_PIN_CODE,
    payload: code,
  };
};

export const setApplockTime = (timeStamp) => {
  return {
    type: actionTypes.SET_APPLOCK_TIME,
    payload: timeStamp,
  };
};

export const setIsUserConfigured = (bool) => {
  return {
    type: actionTypes.SET_IS_USER_CONFIGURED,
    payload: bool,
  };
};
