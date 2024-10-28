import {
  CONTACT_BOOK,
  ENTRIES,
  REPORTS_MENU,
  SALES_DESK,
  LEADS,
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
    icon: require("../../assets/icons/entries.png"),
    title: "Entries",
    target: ENTRIES,
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

  {
    icon: require("../../assets/icons/group-solid-24.png"),
    title: "Leads",
    target: LEADS,
  },
];
