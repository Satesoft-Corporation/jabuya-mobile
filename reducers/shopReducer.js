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
    totalCartCost: 0,
    recievedAmount: 0,
    totalQty: 0,
  },
  cartSelection: null,
  offersDebt: false,
  collectClientInfo: false,
};

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
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
            cartItems: cartItems.map((item) =>
              item.productName === productName
                ? { ...item, quantity: newQty, totalCost: newCost }
                : item
            ),
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

        return {
          ...state,
          cartSelection: newSelection,
        };
      } else {
        return {
          ...state,
          cartSelection: action.payload,
        };
      }
    }

    case actions.UPDATE_RECIEVED_AMOUNT: {
      return {
        ...state,
        cart: {
          ...state.cart,
          recievedAmount: action.payload,
        },
      };
    }

    case actions.CLEAR_CART: {
      return {
        ...state,
        cart: initialState.cart,
        cartSelection: initialState.cartSelection,
      };
    }
    case actions.LOG_OUT: {
      return initialState;
    }

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

    case actions.OFFERS_DEBT: {
      return {
        ...state,
        offersDebt: action.payload,
      };
    }

    case actions.COLLECT_CLIENTS_INFO: {
      return {
        ...state,
        collectClientInfo: action.payload,
      };
    }
    default:
      return state;
  }
};

export default shopReducer;
