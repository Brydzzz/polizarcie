export function parseDate(date: Date | string | undefined) {
  if (!date) return "undefined";
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
}

export function parseTime(date: Date | string | undefined) {
  if (!date) return "undefined";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}
