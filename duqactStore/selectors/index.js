export const getUserData = (state) => state.userData.user;

export const getUsersList = (state) => state.userData.usersList;

export const getFirstTimeInstall = (state) => state.userData?.firstTimeInstall;

export const getUserType = (state) => state.userData.userType;

export const getIsShopOwner = (state) => state.userData.isShopOwner;

export const getIsAdmin = (state) => state.userData.isSuperAdmin;

export const getIsShopAttendant = (state) => state.userData.isShopAttendant;

export const getUserPinCode = (state) => state.userData.userPincode;

export const getOfflineParams = (state) => state.userData.offlineParams;

export const getFilterParams = (state) => state.userData.filterParams;

export const getLastLoginTime = (state) => state.userData.lastLoginTime;

export const getLastApplockTime = (state) => state.userData.lastApplockTime;

export const getConfigureStatus = (state) => state.userData.dataConfigured;

export const getLoginStatus = (state) => state.userData.isLoggedIn;

export const getAttendantShopId = (state) => state.userData.attendantShopId;

export const getAttendantShopName = (state) => state.userData.attendantShopName;

export const getShopOwnerId = (state) => state.userData.shopOwnerId;

export const getShops = (state) => state.userData.shops;

export const getSelectedShop = (state) => state.userData.selectedShop;

export const getOfflineSales = (state) => state.shop.offlineSales;

export const getCartSelection = (state) => state.userData.cartSelection;

export const getCart = (state) => state.userData.cart;

export const getOffersDebt = (state) => state.userData.offersDebt;

export const getCollectClientInfo = (state) => state.userData.collectClientInfo;

export const getMenuList = (state) => state.userData.menuList;

export const getManufactures = (state) => state.shop.manufactures;

export const getSuppliers = (state) => state.shop.suppliers;

export const getHeldSales = (state) => state.userData.heldSales;

export const getLookUps = (state) => state.shop.lookUps;
