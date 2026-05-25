export const formatPrice = (price) => {
  if (price === undefined || price === null) return '₹0';
  return '₹' + Math.round(price * 50).toLocaleString('en-IN');
};
