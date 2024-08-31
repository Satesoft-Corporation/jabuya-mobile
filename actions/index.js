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

export const setShops = (shops) => {
  return {
    type: actionTypes.SET_SHOPS,
    payload: shops,
  };
};

export const changeShop = (shop) => {
  return {
    type: actionTypes.CHANGE_SELECTED_SHOP,
    payload: shop,
  };
};
