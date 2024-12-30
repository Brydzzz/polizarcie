export function getDistance(
  y1: number,
  x1: number,
  y2: number,
  x2: number
): number {
  // Convert degrees to radians
  const toRad = (degree: number): number => degree * (Math.PI / 180);

  const R = 6371e3; // Earth's radius in meters
  const dLat = toRad(y2 - y1);
  const dLon = toRad(x2 - x1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(y1)) *
      Math.cos(toRad(y2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters

  return distance;
}
