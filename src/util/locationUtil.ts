export const distanceToString = (meters: number) => {
  if (meters < 1000) {
    return meters + "m";
  }
  const km = (meters / 1000).toFixed(2);
  return km + "km";
};
