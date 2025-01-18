import { ALL_SHOPS_LABEL, userTypes } from "@constants/Constants";
import { PermissionParams } from "@constants/permissionParams";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import * as actions from "actions/actionTypes";

const initialState = {
  usersList: [],
  prevUser: false,
  isLoggedIn: null,
  dataConfigured: false,
  lastLoginTime: null,
  user: {},
  userType: null,
  attendantShopId: 0,
  attendantShopName: null,
  shopOwnerId: 0,
  isShopAttendant: false,
  isShopOwner: false,
  isSuperAdmin: false,
  userPincode: null,
  lastApplockTime: null,

  offlineParams: {},
  filterParams: {},

  permissions: {},
  permissionPool: [],

  shops: [],
  selectedShop: null,
  shopProducts: [],
  offlineSales: [],
  clients: [],
  clientSales: [],
  heldSales: [],

  cart: { cartItems: [], totalCartCost: 0, recievedAmount: 0, totalQty: 0 },
  cartSelection: null,
  offersDebt: false,
  collectClientInfo: false,
};

const userReduer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOG_OUT: {
      const exisistngUser = state.usersList.find((u) => u.user.id === state.user.id);

      let prevUserState = { ...state };

      delete prevUserState.usersList;
      delete prevUserState.permissions;
      delete prevUserState.permissionPool;
      delete prevUserState.lastLoginTime;

      if (exisistngUser) {
        return { ...initialState, usersList: state.usersList };
      }
      return {
        ...initialState,
        usersList: [...state.usersList, { user: state.user, prevData: prevUserState }],
      };
    }

    case actions.LOGIN_ACTION: {
      const { isShopOwner, isShopAttendant, isSuperAdmin, attendantShopId, shopOwnerId, firstName, lastName, roles, id } = action.payload ?? {};
      const existingUser = state.usersList.find((u) => u.user.id === id);
      const prevData = existingUser?.prevData ?? {};

      const userType =
        isShopAttendant === true
          ? userTypes.isShopAttendant
          : isShopOwner === true
          ? userTypes.isShopOwner
          : isSuperAdmin === true
          ? userTypes.isSuperAdmin
          : null;

      const permissions = [...new Set(roles?.flatMap((item) => item?.permissions || [])?.map((perm) => JSON.stringify(perm)) || [])].map((perm) =>
        JSON.parse(perm)
      );

      const formattedPermissions = Object.keys(PermissionParams).reduce((acc, key) => {
        if (isShopOwner || isSuperAdmin) {
          acc[key] = true;
        } else {
          const matchingPermission = permissions?.find((perm) => PermissionParams[key] === perm.name);
          acc[key] = matchingPermission ? true : false;
        }
        return acc;
      }, {});

      UserSessionUtils.setFirstTimeInsatll("false");
      if (existingUser) {
        return {
          ...state,
          ...prevData,
          lastLoginTime: String(new Date()),
          prevUser: true,
          permissions: formattedPermissions,
          permissionPool: permissions,
        };
      }

      return {
        ...state,
        user: { ...action.payload, fullName: firstName + " " + lastName },
        attendantShopId: attendantShopId,
        shopOwnerId: shopOwnerId,
        lastLoginTime: String(new Date()),
        offlineParams: {
          offset: 0,
          limit: 10000,
          ...(isShopAttendant && { shopId: attendantShopId }),
          ...(isShopOwner && { shopOwnerId: shopOwnerId }),
        },
        isShopOwner,
        isShopAttendant,
        isSuperAdmin,
        userType: userType,
        permissions: formattedPermissions,
        permissionPool: permissions,
        dataConfigured: false,
        isLoggedIn: true,
      };
    }

    case actions.REFRESH_TOKEN: {
      const { isShopOwner, isSuperAdmin, roles } = action.payload ?? {};

      const permissions = [...new Set(roles?.flatMap((item) => item?.permissions || [])?.map((perm) => JSON.stringify(perm)) || [])].map((perm) =>
        JSON.parse(perm)
      );

      const formattedPermissions = Object.keys(PermissionParams).reduce((acc, key) => {
        if (isShopOwner || isSuperAdmin) {
          acc[key] = true;
        } else {
          const matchingPermission = permissions?.find((perm) => PermissionParams[key] === perm.name);
          acc[key] = matchingPermission ? true : false;
        }
        return acc;
      }, {});

      return {
        ...state,
        lastLoginTime: String(new Date()),
        permissions: formattedPermissions,
        permissionPool: permissions,
      };
    }

    case actions.SET_USER_PIN_CODE: {
      return { ...state, userPincode: action.payload };
    }

    case actions.SET_APPLOCK_TIME: {
      return { ...state, lastApplockTime: action.payload };
    }

    case actions.SET_IS_USER_CONFIGURED: {
      return { ...state, dataConfigured: action.payload };
    }

    case actions.ADD_TO_CART: {
      const { productName, quantity, totalCost } = action.payload;

      const { cartItems, totalCartCost, totalQty } = state.cart;

      const exists = cartItems.find((item) => item.productName === productName);

      if (exists) {
        const newCost = exists?.totalCost + totalCost;
        const newQty = exists?.quantity + quantity;

        return {
          ...state,
          cart: {
            cartItems: cartItems.map((item) => (item.productName === productName ? { ...item, quantity: newQty, totalCost: newCost } : item)),
            totalCartCost: totalCartCost + totalCost,
            totalQty: totalQty + quantity,
            recievedAmount: state.cart.recievedAmount,
          },
        };
      } else {
        return {
          ...state,
          cart: {
            cartItems: [...state.cart.cartItems, action.payload],
            totalCartCost: totalCartCost + totalCost,
            totalQty: totalQty + quantity,
            recievedAmount: state.cart.recievedAmount,
          },
        };
      }
    }

    case actions.REMOVE_FROM_CART: {
      const { productName } = action.payload;

      const { cartItems, totalCartCost, totalQty } = state.cart;

      const exists = cartItems.find((item) => item.productName === productName);

      if (exists) {
        const newCost = totalCartCost - exists?.totalCost;
        const newQty = totalQty - exists?.quantity;

        return {
          ...state,
          cart: {
            cartItems: cartItems.filter((item) => item.productName !== productName),
            totalCartCost: newCost,
            totalQty: newQty,
            recievedAmount: state.cart.recievedAmount,
          },
        };
      }
    }

    case actions.MAKE_PRODUCT_SELECTION: {
      if (action.payload !== null) {
        let newSelection = { ...action.payload };

        const { multipleSaleUnits, saleUnitName, salesPrice } = action.payload;
        const defUnit = {
          productSaleUnitName: saleUnitName,
          unitPrice: salesPrice,
        };

        if (multipleSaleUnits) {
          newSelection.saleUnits = [defUnit, ...multipleSaleUnits];
        } else {
          newSelection.saleUnits = [{ ...defUnit }];
          newSelection.selectedSaleUnit = defUnit;
          newSelection.salesPrice = salesPrice;
        }

        return { ...state, cartSelection: newSelection };
      } else {
        return { ...state, cartSelection: action.payload };
      }
    }

    case actions.UPDATE_RECIEVED_AMOUNT: {
      return { ...state, cart: { ...state.cart, recievedAmount: action.payload } };
    }

    case actions.CLEAR_CART: {
      return { ...state, cart: initialState.cart, cartSelection: initialState.cartSelection };
    }

    case actions.SET_SHOPS: {
      return { ...state, shops: action.payload };
    }

    case actions.SET_SHOP_PRODUCTS: {
      return { ...state, shopProducts: action.payload };
    }

    case actions.CHANGE_SELECTED_SHOP: {
      const allShops = action.payload.name === ALL_SHOPS_LABEL;

      let obj = {};

      if (state.userType === userTypes.isShopOwner && allShops) {
        obj.shopOwnerId = state.shopOwnerId;
      }

      if (!allShops) {
        obj.shopId = action.payload?.id;
      }

      return {
        ...state,
        selectedShop: action.payload,
        offersDebt: action.payload?.supportsCreditSales,
        collectClientInfo: action.payload?.captureClientDetailsOnAllSales,
        filterParams: obj,
      };
    }

    case actions.ADD_OFFLINE_SALE: {
      return { ...state, offlineSales: [...state.offlineSales, action.payload] };
    }

    case actions.REMOVE_OFFLINE_SALE: {
      let pendingSales = state.offlineSales;
      pendingSales.splice(action.payload, 1); // Removes the sale record at the specified index
      return { ...state, offlineSales: pendingSales };
    }

    case actions.ADD_CLIENT_SALES: {
      return { ...state, clientSales: action.payload };
    }

    case actions.ADD_SHOP_CLIENTS: {
      const sorted = action?.payload?.sort((a, b) => {
        if (a?.fullName < b?.fullName) {
          return -1;
        }
        if (a?.fullName > b?.fullName) {
          return 1;
        }
        return 0;
      });
      return { ...state, clients: sorted };
    }

    case actions.ADD_HELD_TXN: {
      return { ...state, heldSales: [...state.heldSales, action.payload] };
    }

    case actions.REMOVE_HELD_TXN: {
      const filtered = [...state.heldSales].filter((item) => item?.clientName !== action.payload);
      return { ...state, heldSales: filtered };
    }

    case actions.ADD_HELD_TXNS_TO_CART: {
      const { items } = action.payload;

      const newCost = items?.reduce((a, b) => a + b?.totalCost, 0);
      const newQty = items?.reduce((a, b) => a + b?.quantity, 0);

      return { ...state, cart: { cartItems: items, totalCartCost: newCost, totalQty: newQty, recievedAmount: 0 } };
    }

    default:
      return state;
  }
};

export default userReduer;
