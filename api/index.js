export const USER_ENDPOINT = {
  GET_ALL: "/users",
  GET_ROLES: "/users/roles",
  POST_ROLE: "/users/roles",
  GET_PERMISSIONS: "/users/permissions",
  DELETE_ROLE: (id) => `/users/roles/${id}`,
  GET_BY_ID: (id) => `/users/${id}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  CREATE: "/users",
};

export const SUPPLIER_ENDPOINT = {
  GET_ALL: "/suppliers",
  GET_BY_ID: (id) => `/suppliers/${id}`,
  UPDATE: (id) => `/suppliers/${id}`,
  DELETE: (id) => `/suppliers/${id}`,
  CREATE: "/suppliers",
};

export const STOCK_ENDPOINT = {
  GET_ALL: "/stock-entries",
  GET_BY_ID: (id) => `/stock-entries/${id}`,
  UPDATE: (id) => `/stock-entries/${id}`,
  DELETE: (id) => `/stock-entries/${id}`,
  CREATE: "/stock-entries",
  UPLOAD: (shopId) => `/stock-entries/upload/${shopId}`,
  UNPACK: "/stock-entries/unpack",
  STOCK_WITH_SALE_UNIT: "/stock-entries/stock-with-sale-unit",
  NEW_PRODUCT: "/stock-entries/new-product",
};

export const SHOP_ENDPOINT = {
  GET_ALL: "/shops",
  GET_BY_ID: (id) => `/shops/${id}`,
  UPDATE: (id) => `/shops/${id}`,
  DELETE: (id) => `/shops/${id}`,
  CREATE: "/shops",
  UPDATE_SUMMARY: (id) => `/shops/${id}/update-summary`,
  GET_CAPITAL: "/shops/capital",
  POST_CAPITAL: "/shops/capital",
  GET_USER_ACCOUNTS: (id) => `/shops/${id}/user-accounts`,
  GET_LOCATIONS: "/shops/locations",
};

export const SHOP_ATTENDANT_ENDPOINT = {
  GET_ALL: "/shops/attendants",
  GET_BY_ID: (id) => `/shops/attendants/${id}`,
  UPDATE: (id) => `/shops/attendants/${id}`,
  DELETE: (id) => `/shops/attendants/${id}`,
  CREATE: "/shops/attendants",
  ATTACH_ROLES: (id) => `/shops/attendants/${id}/attach-roles`,
};

export const SHOP_OWNER_ENDPOINT = {
  GET_ALL: "/shop/owners",
  GET_BY_ID: (id) => `/shop/owners/${id}`,
  UPDATE: (id) => `/shop/owners/${id}`,
  DELETE: (id) => `/shop/owners/${id}`,
  CREATE: "/shop/owners",
  ACTIVATE: (id) => `/shop/owners/${id}/activate`,
};

export const SHOP_SALE_ENDPOINT = {
  GET_ALL: "/shop-sales",
  GET_BY_ID: (id) => `/shop-sales/${id}`,
  UPDATE: (id) => `/shop-sales/${id}`,
  DELETE: (id) => `/shop-sales/${id}`,
  CREATE: "/shop-sales",
  CONFIRM: (id) => `/shop-sales/${id}/confirm`,
  CANCEL: (id) => `/shop-sales/${id}/cancel`,
  UPDATE_STOCK_MAPPINGS: "/shop-sales/update-stock-mappings",
  CANCEL_LINE_ITEM: (id) => `/shop-sales/line-item/${id}/cancel`,
  GET_LINE_ITEMS: "/shop-sales/line-items",
};

export const PRODUCT_ENDPOINT = {
  GET_ALL: "/products",
  GET_BY_ID: (id) => `/products/${id}`,
  UPDATE: (id) => `/products/${id}`,
  DELETE: (id) => `/products/${id}`,
  CREATE: "/products",
  QUICK_POST: "/products/quick-post",
};

export const CREDIT_SALE_ENDPOINT = {
  PAYMENTS: "/credit-sales/payments",
  PAY: (saleId, idType) => `/credit-sales/${saleId}/${idType}/pay`,
  CREDIT_SALE_PAYMENTS: (creditSaleId) => `/credit-sales/${creditSaleId}/payments`,
  GET_ALL: "/credit-sales",
  GET_BY_ID: (id) => `/credit-sales/${id}`,
  DELETE_PAYMENT: (id) => `/credit-sales/payments/${id}`,
};

export const SHOP_PRODUCT_ENDPOINT = {
  GET_ALL: "/shop-products",
  CREATE: "/shop-products",
  CREATE_FOR_SHOP: (shopId) => `/shop-products/${shopId}`,
  UPDATE_SUMMARY: (id) => `/shop-products/${id}/update-summary`,
  UNLIST: (id) => `/shop-products/${id}/unlist`,
  GET_BY_ID: (id) => `/shop-products/${id}`,
};

export const AUTH_ENDPOINT = {
  LOGIN: "/auth/login",
  REGISTER_SHOP_OWNER: "/auth/register/shop-owner",
  REFRESH_TOKEN: "/auth/refresh/token",
  PASSWORD_RESET_INITIATE: "/auth/password-reset/initiate",
  PASSWORD_RESET_VERIFY_OTP: "/auth/password-reset/verify-otp",
  PASSWORD_RESET_DO: "/auth/password-reset/do",
  RESEND_ACTIVATE_OTP: (shopOwnerId) => `/auth/shop-owner/${shopOwnerId}/resend-activate-by-otp`,
  ACTIVATE_BY_OTP: (shopOwnerId) => `/auth/shop-owner/${shopOwnerId}/activate-by-otp`,
};

export const REPORTS_ENDPOINT = {
  GET_SHOP_USER_SUMMARIES: "/reports/shop-user-summaries",
  GET_SHOP_SUMMARIES: "/reports/shop-summaries",
  GET_PRODUCT_STOCK_INFO: "/reports/product-stock-info",
};
