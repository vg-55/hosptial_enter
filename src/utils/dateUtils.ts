import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const formatDate = (date: Date, formatStr = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = subDays(endDate, 7);
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export const getLastMonthRange = () => {
  const today = new Date();
  const lastMonth = subMonths(today, 1);
  return {
    startDate: formatDate(startOfMonth(lastMonth)),
    endDate: formatDate(endOfMonth(lastMonth)),
  };
};

export const getThisMonthRange = () => {
  const today = new Date();
  return {
    startDate: formatDate(startOfMonth(today)),
    endDate: formatDate(endOfMonth(today)),
  };
};
