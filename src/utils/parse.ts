const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[Rp.]/g, "").replace(",", "."));
};

export { parseCurrency };
