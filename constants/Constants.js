export const StockingTabTitles = {
  PurchaseTitle: "Stock purchase",
  LevelsTitle: "Stock level",
  ListingTitle: "Stock listing",
};

export const packageOptions = [
  { value: "Packed", type: true },
  { value: "Unpacked", type: false },
];

export const categoryIcons = [
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
