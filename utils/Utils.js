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

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = date.getFullYear() % 100; // Get last two digits of the year

  // Pad day and month with leading zeros if necessary
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}
