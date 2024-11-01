const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[Rp.]/g, "").replace(",", "."));
};

const parseDecimal = (value: string) => {
  return parseFloat(value.replace(/,/g, "."));
}

const formatedCurrency = (value: number) => {
  const result = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

  return result;
};

const formatedDecimal = (value: number) => {
  const result = new Intl.NumberFormat("id-ID").format(value);

  return result;
}

export { parseCurrency, formatedCurrency, parseDecimal, formatedDecimal };
