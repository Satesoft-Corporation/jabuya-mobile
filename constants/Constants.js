import { Dimensions } from "react-native";

export const packageOptions = [
  { value: "Packed", type: true },
  { value: "Unpacked", type: false },
];

export const categoryIcons = [
  // landing screen icons
  {
    id: 1,
    icon: require("../assets/icons/icons8-cash-register-50.png"),
    title: "Sales Desk",
    target: "salesEntry",
  },
  {
    id: 2,
    icon: require("../assets/icons/icons8-report-50.png"),
    title: "Reports",
    target: "viewSales",
  },
  {
    id: 3,
    icon: require("../assets/icons/icons8-box-50.png"),
    title: "Stocking",
    target: "stocking",
  },
  {
    id: 4,
    icon: require("../assets/icons/icons8-chat-50.png"),
    title: "Chat",
  },
];

export const dummyLoginResponse = {
  status: "success",
  message: "User created successfully",
  user: {
    status: "active",
    message: "User account is active",
    createdById: 1,
    createdByUsername: "admin",
    createdByFullName: "Admin User",
    changedById: 1,
    changedByUserName: "admin",
    changedByFullName: "Admin User",
    dateCreated: "2023-12-28T08:43:13.831Z",
    dateChanged: "2023-12-28T08:43:13.831Z",
    recordStatus: "active",
    serialNumber: "SN123456",
    id: 101,
    username: "john_doe",
    roles: [
      {
        status: "active",
        message: "Role created successfully",
        createdById: 1,
        createdByUsername: "admin",
        createdByFullName: "Admin User",
        changedById: 1,
        changedByUserName: "admin",
        changedByFullName: "Admin User",
        dateCreated: "2023-12-28T08:43:13.831Z",
        dateChanged: "2023-12-28T08:43:13.831Z",
        recordStatus: "active",
        serialNumber: "SN654321",
        id: 201,
        name: "user",
        description: "Regular User",
        permissionIds: [1],
        permissions: [
          {
            id: 1,
            name: "ADD_USERS",
            moduleName: "USER_MANAGEMENT",
          },
        ],
      },
    ],
    roleIds: [201],
    emailAddress: "john.doe@example.com",
    lastName: "Doe",
    firstName: "John",
    gender: "male",
    genderId: 1,
    phoneNumber: "+1234567890",
    initialPassword: "initial123",
    countryName: "United States",
    countryId: 1,
    isSuperAdmin: false,
    isShopOwner: false,
    shopOwnerId: 0,
    isShopAttendant: true,
    shopAttendantId: 301,
    attendantShopId: 401,
    attendantShopName: "ABC Mart",
    permissions: ["ADD_USERS"],
    shops: [{}],
    superAdmin: false,
    shopOwner: false,
    shopAttendant: true,
  },
  accessToken: "dummyAccessToken123",
  refreshToken: "dummyRefreshToken456",
};

export const MAXIMUM_RECORDS_PER_FETCH = 20;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const dummy = {
  status: "active",
  message: "Data entry successful",
  createdById: 123,
  createdByUsername: "john_doe",
  createdByFullName: "John Doe",
  changedById: 456,
  changedByUserName: "jane_smith",
  changedByFullName: "Jane Smith",
  dateCreated: "2024-02-27T12:35:08.774Z",
  dateChanged: "2024-02-27T12:35:08.774Z",
  recordStatus: "available",
  serialNumber: "SN123456",
  id: 789,
  quantityInStock: 100,
  productId: 101,
  productName: "Sample Product",
  saleUnitName: "each",
  saleUnitId: 1,
  packageUnitName: "box",
  packageUnitId: 2,
  salesPrice: 10.99,
  remarks: "This is a sample product",
  barcode: "123456789012",
  shopId: 987,
  shopName: "Sample Shop",
  manufacturerId: 654,
  manufacturerName: "Sample Manufacturer",
  categoryId: 321,
  categoryName: "Sample Category",
  multipleSaleUnits: [
    {
      id: 1,
      productSaleUnitId: 101,
      productSaleUnitName: "each",
      unitPrice: 10.99,
    },
    {
      id: 2,
      productSaleUnitId: 101,
      productSaleUnitName: "box",
      unitPrice: 109.9,
    },
  ],
  hasMultipleSaleUnits: true,
};
