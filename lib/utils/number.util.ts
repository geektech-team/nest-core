export const toPercent = (originNumber: number, decimals = 2) => {
  if (!originNumber) {
    return '0%';
  }
  return (originNumber * 100).toFixed(decimals) + '%';
};
