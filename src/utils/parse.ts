const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[Rp.]/g, "").replace(",", "."));
};

const formatedCurrency = (value: number) => {
  const result = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

  return result;
};

export { parseCurrency, formatedCurrency };
