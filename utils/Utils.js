// eas build -p android --profile preview
export function formatNumberWithCommas(number) {
  number = Number(number);
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}

export function formatDate(inputDate, removeTime = false, onlyTime = false) {
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

export function extractTime(inputDate) {
  const date = new Date(inputDate);

  // Define options for formatting the time
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format
  };

  const formattedTime = date.toLocaleTimeString("en-US", options);

  return formattedTime;
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

export function getCurrentDay(getTomorrowDate = false) {
  const now = new Date();
  if (getTomorrowDate === true) {
    now.setDate(now.getDate() - 1);
  }
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  let hours = "00";
  let minutes = "00";
  let seconds = "00";
  let milliseconds = "00";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function convertDateFormat(dateString, getTomorrowDate = false) {
  const date = new Date(dateString); // Create a Date object from the input string

  if (getTomorrowDate === true) {
    date.setDate(date.getDate() + 1); // Increment the date by 1 to get tomorrow's date
  }

  const isoDateString = date.toISOString(); // Convert Date object to ISO string
  return isoDateString;
}

export function getTimeDifference(date1, date2) {
  let parsedDate1 = date1.getTime();
  let parsedDate2 = date2.getTime();

  let timeDifference = Math.abs(parsedDate1 - parsedDate2);

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  timeDifference -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  timeDifference -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(timeDifference / (1000 * 60));
  timeDifference -= minutes * (1000 * 60);

  const seconds = Math.floor(timeDifference / 1000);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

export const isValidNumber = (num) => {
  let reg = /^[-+]?[0-9]*\.?[0-9]+$/;

  return reg.test(num);
};
