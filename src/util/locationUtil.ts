export const distanceToString = (meters: number) => {
  if (meters < 1000) {
    return Math.round(meters) + "m";
  }
  const km = (meters / 1000).toFixed(2);
  return km + "km";
};
