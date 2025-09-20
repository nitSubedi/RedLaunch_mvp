export function getModelType() {
  if (!navigator.onLine) return "average";
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) return "arima";
  return "prophet";
}