export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function parseDate(date: Date | string | undefined) {
  if (!date) return "undefined";
  return new Date(date).toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: getUserTimeZone(),
  });
}

export function parseTime(date: Date | string | undefined) {
  if (!date) return "undefined";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: getUserTimeZone(),
  });
}
