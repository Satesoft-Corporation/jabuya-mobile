export function formatNumberWithCommas(number) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}

export function formatDate(inputDate, removeTime = false) {
  let options;
  if (removeTime === true) {
    options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  } else {
    options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  }
  const date = new Date(inputDate);

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

export function formatDateToDDMMYY(dateString) {
  const date = new Date(dateString);

  if (isNaN(date)) {
    return "Invalid Date";
  }
  if (dateString === null) {
    return false;
  }
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = date.getFullYear() % 100; // Get last two digits of the year

  // Pad day and month with leading zeros if necessary
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}

export const convertToServerDate = (dateValue) => {
  const utcDate = new Date(dateValue);
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, "0");
  const day = String(utcDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function toReadableDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = new Date(dateString);
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  if (dateString === null || dateString === undefined) {
    return true;
  }
  return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

export function hasNull(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      return true;
    }
  }
  return false;
}
