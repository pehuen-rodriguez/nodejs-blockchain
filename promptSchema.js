module.exports = {
  properties: {
    price: {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "Price must be a number",
      required: true,
    },
    type: {
      pattern: /^(buy|sale)$/,
      message: "Operation type is either buy or sale",
      required: true,
    },
    amount: {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: "Amount must be a number",
      required: true,
    },
  },
};
