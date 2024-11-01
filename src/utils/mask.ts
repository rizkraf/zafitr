import { maskitoNumberOptionsGenerator } from "@maskito/kit";

export const maskitoCurrency = maskitoNumberOptionsGenerator({
  precision: 2,
  decimalSeparator: ",",
  thousandSeparator: ".",
  min: 1,
  prefix: "Rp",
});

export const maskitoNumber = maskitoNumberOptionsGenerator({
  precision: 2,
  decimalSeparator: ",",
  min: 1,
});
