export const expressions = {
  englishOnly: /^[A-Za-z ]+$/,
  hindiOnly: /^[\u0900-\u097F ]+$/,
  alphaNumericOnly: /^[A-Za-z0-9]+$/,
  alphaNumericOnlyWithSpace: /^[A-Za-z0-9 ]+$/,
  alphaNumericPlusMinus: /^[A-Za-z1-2+-]+$/,
  numericOnly: /^[0-9]+$/,
  englishWithSymbols: /^[A-Za-z .,()&/]+$/,
  hindiWithSymbols: /^[\u0900-\u097F .,()&/]+$/,
  alphaNumericOnlyWithSpaceAndDot: /^[A-Za-z0-9 .]+$/,
};

export const messages = {
  'any.required': 'Required',
  'object.base': 'Required',
  'string.empty': 'Required',
  'number.min': 'Must be >= {#limit}',
  'number.max': 'Must be <= {#limit}',
  'number.base': 'Invalid number',
};

export const keys = {
  number: {
    greater: 'number.greater',
  },
  string: {
    pattern: 'string.pattern.base',
  },
};

export const sanitizeInput = (value: string): string => {
  // Remove global restricted characters
  let cleanValue = value.replace(/[!'"[\]{}<>*$#^]/g, '');

  // Remove restricted characters from the start
  // =, +, -, @, Tab (\t), Carriage Return (\r), Newline (\n)
  cleanValue = cleanValue.replace(/^[=+\-@\t\r\n]+/g, '');

  return cleanValue;
};
