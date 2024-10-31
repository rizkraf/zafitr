import { maskitoNumberOptionsGenerator } from "@maskito/kit";

export default maskitoNumberOptionsGenerator({
  precision: 2,
  decimalSeparator: ",",
  thousandSeparator: ".",
  min: 1,
  prefix: "Rp",
});
