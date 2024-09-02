import { userTypes } from "@constants/Constants";
import * as actions from "actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  dataConfigured: false,
  lastLoginTime: null,
  user: {},
  userType: null,
  attendantShopId: null,
  shopOwnerId: null,
  userPincode: null,
  lastApplockTime: null,
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
        lastLoginTime: String(new Date()),
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

    case actions.SET_USER_PIN_CODE: {
      return {
        ...state,
        userPincode: action.payload,
      };
    }

    case actions.SET_APPLOCK_TIME: {
      return {
        ...state,
        lastApplockTime: action.payload,
      };
    }

    case actions.SET_IS_USER_CONFIGURED: {
      return {
        ...state,
        dataConfigured: action.payload,
      };
    }

    default:
      return state;
  }
};

export default userReduer;
