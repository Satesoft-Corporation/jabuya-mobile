import { userTypes } from "@constants/Constants";
import * as actions from "actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  user: {},
  userType: null,
  attendantShopId: null,
  shopOwnerId: null,
  userPincode: null,
  shops: [],
  selectedShop: null,
  offlineParams: {},
};

const userReduer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGIN_ACTION: {
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    }

    case actions.CHANGE_USER: {
      const {
        isShopOwner,
        isShopAttendant,
        isSuperAdmin,
        attendantShopId,
        shopOwnerId,
        firstName,
        lastName,
      } = action.payload ?? {};

      return {
        ...state,
        user: { ...action.payload, fullName: firstName + " " + lastName },
        attendantShopId: attendantShopId,
        shopOwnerId: shopOwnerId,
        offlineParams: {
          offset: 0,
          limit: 10000,
          ...(isShopAttendant && { shopId: attendantShopId }),
          ...(isShopOwner && { shopOwnerId: shopOwnerId }),
        },
        userType:
          isShopAttendant === true
            ? userTypes.isShopAttendant
            : isShopOwner === true
            ? userTypes.isShopOwner
            : isSuperAdmin === true
            ? userTypes.isSuperAdmin
            : null,
      };
    }

    case actions.SET_SHOPS: {
      return {
        ...state,
        shops: action.payload,
      };
    }

    case actions.CHANGE_SELECTED_SHOP: {
      return {
        ...state,
        selectedShop: action.payload,
      };
    }

    default:
      return state;
  }
};

export default userReduer;
