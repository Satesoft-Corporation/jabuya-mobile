export const getUserData = (state) => state.userData.user;

export const getUserType = (state) => state.userData.userType;

export const getUserPinCode = (state) => state.userData.userPincode;

export const getOfflineParams = (state) => state.userData.offlineParams;

export const getLastLoginTime = (state) => state.userData.lastLoginTime;

export const getLastApplockTime = (state) => state.userData.lastApplockTime;

export const getConfigureStatus = (state) => state.userData.dataConfigured;

export const getLoginStatus = (state) => state.userData.isLoggedIn;

export const getAttendantShopId = (state) => state.userData.attendantShopId;

export const getShopOwnerId = (state) => state.userData.shopOwnerId;

export const getShops = (state) => state.shop.shops;
