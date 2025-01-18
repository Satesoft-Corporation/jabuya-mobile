import { CONTACT_BOOK, ENTRIES, LEADS, REPORTS_MENU, SALES_DESK } from "@navigation/ScreenNames";

export const getNavList = (isAdmin = false) => {
  return [
    // landing screen icons
    { icon: require("../../assets/icons/icons8-cash-register-50.png"), title: "Sales Desk", target: SALES_DESK },
    { icon: require("../../assets/icons/icons8-report-50.png"), title: "Reports", target: REPORTS_MENU },
    { icon: require("../../assets/icons/entries.png"), title: "Entries", target: ENTRIES },
    { icon: require("../../assets/icons/icons8-contact-book-64.png"), title: "Contacts", target: CONTACT_BOOK },
    ...(isAdmin ? [{ icon: require("assets/icons/group-solid-24.png"), title: "Leads", target: LEADS }] : []),
  ];
};
