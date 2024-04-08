import {
  SALES_DESK,
  SALES_REPORTS,
  STOCKNG,
  CREDIT_MENU,
  CONTACT_BOOK,
  EXPENSES,
} from "../../navigation/ScreenNames";
export const navList = [
  // landing screen icons
  {
    id: 1,
    icon: require("../../assets/icons/icons8-cash-register-50.png"),
    title: "Sales Desk",
    target: SALES_DESK,
  },
  {
    id: 2,
    icon: require("../../assets/icons/icons8-report-50.png"),
    title: "Reports",
    target: SALES_REPORTS,
  },
  {
    id: 3,
    icon: require("../../assets/icons/icons8-box-50.png"),
    title: "Stocking",
    target: STOCKNG,
  },
  {
    id: 4,
    icon: require("../../assets/icons/open-hand.png"),
    title: "Credit/Debit",
    target: CREDIT_MENU,
  },
  {
    id: 5,
    icon: require("../../assets/icons/icons8-contact-book-64.png"),
    title: "Contact Book",
    target: CONTACT_BOOK,
  },
  {
    id: 6,
    icon: require("../../assets/icons/icons8-chat-50.png"),
    title: "Chat",
  },
  {
    id: 6,
    icon: require("../../assets/icons/icons8-chat-50.png"),
    title: "Expenses",
    target: EXPENSES,
  },
];
