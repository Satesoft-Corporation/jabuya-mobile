export const getUserData = (state) => state.userData.user;

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

export const getShops = (state) => state.shop.shops;

export const getSelectedShop = (state) => state.shop.selectedShop;

export const getShopProducts = (state) => state.shop.shopProducts;

export const getShopClients = (state) => state.shop.clients;

export const getClientSales = (state) => state.shop.clientSales;

export const getOfflineSales = (state) => state.shop.offlineSales;

export const getCartSelection = (state) => state.shop.cartSelection;

export const getCart = (state) => state.shop.cart;

export const getOffersDebt = (state) => state.shop.offersDebt;

export const getCollectClientInfo = (state) => state.shop.collectClientInfo;

export const getMenuList = (state) => state.userData.menuList;

export const getManufactures = (state) => state.shop.manufactures;

export const getSuppliers = (state) => state.shop.suppliers;

export const getHeldSales = (state) => state.shop.heldSales;

export const getLookUps = (state) => state.userData.lookUps;
