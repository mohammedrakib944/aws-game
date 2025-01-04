export const generateUniqueNumber = () => {
  let uniqueNumber = "";
  const digits = "0123456789";

  while (uniqueNumber.length < 6) {
    let digit = digits[Math.floor(Math.random() * digits.length)];
    if (!uniqueNumber.includes(digit)) {
      uniqueNumber += digit;
    }
  }

  return uniqueNumber;
};
