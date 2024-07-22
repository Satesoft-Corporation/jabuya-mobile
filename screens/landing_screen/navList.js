import {
  CONTACT_BOOK,
  REPORTS_MENU,
  SALES_DESK,
} from "@navigation/ScreenNames";

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
    target: REPORTS_MENU,
  },
  {
    id: 5,
    icon: require("../../assets/icons/icons8-contact-book-64.png"),
    title: "Contacts",
    target: CONTACT_BOOK,
  },

  {
    id: 3,
    icon: require("../../assets/icons/cctv.png"),
    title: "Camera",
  },

  {
    id: 6,
    icon: require("../../assets/icons/icons8-chat-50.png"),
    title: "Chat",
  },
  {
    id: 3,
    icon: require("../../assets/icons/settings.png"),
    title: "Settings",
  },
];
