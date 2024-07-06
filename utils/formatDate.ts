import dayjs from "#build/dayjs.imports.mjs";

export const formatDate = (date: number): string => {
  return dayjs(date).format("DD/MM/YYYY");
};
