import * as actions from "actions/actionTypes";

const initialState = {
  offlineSales: [],
  suppliers: [],
  lookUps: [],
};

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_OFFLINE_SALE: {
      return { ...state, offlineSales: [...state.offlineSales, action.payload] };
    }

    case actions.REMOVE_OFFLINE_SALE: {
      let pendingSales = state.offlineSales;
      pendingSales.splice(action.payload, 1); // Removes the sale record at the specified index
      return { ...state, offlineSales: pendingSales };
    }

    case actions.ADD_SUPPLIERS: {
      return { ...state, suppliers: action.payload };
    }

    case actions.ADD_LOOK_UPS: {
      return { ...state, lookUps: action.payload };
    }

    default:
      return state;
  }
};

export default shopReducer;
