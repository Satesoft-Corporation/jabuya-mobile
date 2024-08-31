import { userTypes } from "@constants/Constants";
import * as actions from "actions/actionTypes";

const initialState = {
  cartItems: [],
  shopProducts: [],
  offlineSales: [],
};

const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_TO_CART: {
      return {
        ...state,
        cartItems: action.payload,
      };
    }

    default:
      return state;
  }
};

export default salesReducer;
