import * as actionTypes from "./actionTypes";

export const setShops = (shops) => {
  return {
    type: actionTypes.SET_SHOPS,
    payload: shops,
  };
};

export const changeSelectedShop = (shop) => {
  return {
    type: actionTypes.CHANGE_SELECTED_SHOP,
    payload: shop,
  };
};

export const setShopProducts = (products) => {
  return {
    type: actionTypes.SET_SHOP_PRODUCTS,
    payload: products,
  };
};

export const addOfflineSale = (sale) => {
  return {
    type: actionTypes.ADD_OFFLINE_SALE,
    payload: sale,
  };
};
export const removeOfflineSale = (index) => {
  return {
    type: actionTypes.REMOVE_OFFLINE_SALE,
    payload: index,
  };
};

export const setShopClients = (clients) => {
  return {
    type: actionTypes.ADD_SHOP_CLIENTS,
    payload: clients,
  };
};

export const setClientSales = (clientSales) => {
  return {
    type: actionTypes.ADD_CLIENT_SALES,
    payload: clientSales,
  };
};

export const makeProductSelection = (product) => {
  return {
    type: actionTypes.MAKE_PRODUCT_SELECTION,
    payload: product,
  };
};

export const changeSelectionSaleUnit = (product) => {
  return {
    type: actionTypes.CHANGE_sELECTION_SALE_UNIT,
    payload: product,
  };
};

export const addItemToCart = (item) => {
  return {
    type: actionTypes.ADD_TO_CART,
    payload: item,
  };
};

export const clearCart = () => {
  return {
    type: actionTypes.CLEAR_CART,
  };
};

export const updateRecievedAmount = (amount) => {
  return {
    type: actionTypes.UPDATE_RECIEVED_AMOUNT,
    payload: amount,
  };
};

export const addManufacturers = (list) => {
  return {
    type: actionTypes.ADD_MANUFACTURERS,
    payload: list,
  };
};
export const addSuppliers = (list) => {
  return {
    type: actionTypes.ADD_SUPPLIERS,
    payload: list,
  };
};

export const holdSale = (sale) => {
  return {
    type: actionTypes.ADD_HELD_TXN,
    payload: sale,
  };
};

export const addHeldSalesToCart = (sales) => {
  return {
    type: actionTypes.ADD_HELD_TXNS_TO_CART,
    payload: sales,
  };
};

export const removeHeldSale = (clientName) => {
  return {
    type: actionTypes.REMOVE_HELD_TXN,
    payload: clientName,
  };
};
