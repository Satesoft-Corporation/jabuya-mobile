import { ALL_SHOPS_LABEL, userTypes } from "@constants/Constants";
import { CONTACT_BOOK, ENTRIES, LEADS } from "@navigation/ScreenNames";
import { navList } from "@screens/landing_screen/navList";
import * as actions from "actions/actionTypes";

const initialState = {
  isLoggedIn: false,
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
  menuList: [],
  lookUps: [],
};

const userReduer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOG_OUT: {
      return initialState;
    }
    case actions.LOGIN_ACTION: {
      return { ...state, isLoggedIn: action.payload };
    }

    case actions.CHANGE_USER: {
      const { isShopOwner, isShopAttendant, isSuperAdmin, attendantShopId, shopOwnerId, firstName, lastName } = action.payload ?? {};

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
      const offersDebt = action.payload?.some((s) => s?.supportsCreditSales === true);

      let menuList = [...navList];

      if (state.userType === userTypes.isShopAttendant) {
        menuList = menuList.filter((i) => i.target !== ENTRIES);
      }

      if (state.userType === userTypes.isSuperAdmin) {
        menuList = [...menuList, { icon: require("../assets/icons/group-solid-24.png"), title: "Leads", target: LEADS }];
      }

      if (offersDebt === false) {
        menuList = menuList.filter((i) => i.target !== CONTACT_BOOK);
      }

      return { ...state, menuList: menuList };
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

    case actions.CHANGE_SELECTED_SHOP: {
      const allShops = action.payload.name === ALL_SHOPS_LABEL;

      let obj = {};

      if (state.userType === userTypes.isShopOwner && allShops) {
        obj.shopOwnerId = state.shopOwnerId;
      }

      if (!allShops) {
        obj.shopId = action.payload?.id;
      }

      return { ...state, filterParams: obj };
    }
    case actions.ADD_LOOK_UPS: {
      return { ...state, lookUps: action.payload };
    }
    default:
      return state;
  }
};

export default userReduer;
