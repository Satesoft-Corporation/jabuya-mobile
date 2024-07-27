import {
  CONTACT_BOOK,
  EXPENSES,
  REPORTS_MENU,
  SALES_DESK,
} from "@navigation/ScreenNames";

export const navList = [
  // landing screen icons
  {
    icon: require("../../assets/icons/icons8-cash-register-50.png"),
    title: "Sales Desk",
    target: SALES_DESK,
  },
  {
    icon: require("../../assets/icons/icons8-report-50.png"),
    title: "Reports",
    target: REPORTS_MENU,
  },
  {
    icon: require("../../assets/icons/icons8-contact-book-64.png"),
    title: "Contacts",
    target: CONTACT_BOOK,
  },

  {
    icon: require("../../assets/icons/cctv.png"),
    title: "Camera",
  },

  {
    icon: require("../../assets/icons/icons8-chat-50.png"),
    title: "Chat",
  },
  // {
  //   icon: require("../../assets/icons/spending.png"),
  //   title: "Expenses",
  //   target: EXPENSES,
  // },
];
