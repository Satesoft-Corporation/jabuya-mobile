import * as actions from "actions/actionTypes";

const initialState = {
  shops: [],
  selectedShop: null,
  shopProducts: [],
  offlineSales: [],
  clients: [],
  clientSales: [],
  cart: {
    cartItems: [],
    totalCost: 0,
    recievedAmount: 0,
    selection: null,
  },
};

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SHOPS: {
      return {
        ...state,
        shops: action.payload,
      };
    }

    case actions.SET_SHOP_PRODUCTS: {
      return {
        ...state,
        shopProducts: action.payload,
      };
    }

    case actions.CHANGE_SELECTED_SHOP: {
      return {
        ...state,
        selectedShop: action.payload,
      };
    }

    case actions.ADD_OFFLINE_SALE: {
      return {
        ...state,
        offlineSales: [...state.offlineSales, action.payload],
      };
    }

    case actions.REMOVE_OFFLINE_SALE: {
      let pendingSales = state.offlineSales;
      pendingSales.splice(action.payload, 1); // Removes the sale record at the specified index
      return {
        ...state,
        offlineSales: pendingSales,
      };
    }

    case actions.ADD_CLIENT_SALES: {
      return {
        ...state,
        clientSales: action.payload,
      };
    }

    case actions.ADD_SHOP_CLIENTS: {
      return {
        ...state,
        clients: action.payload,
      };
    }

    default:
      return state;
  }
};

export default shopReducer;
