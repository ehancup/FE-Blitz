import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: number | string | Date, args?: { format?: 'default' | 'server' }) => {
  if (!date) return '-'

  const formatValue = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(formatValue)) return '-'

  if (args?.format === 'server') {
    return format(formatValue, 'yyyy-MM-dd', { locale: id })
  }

  return format(formatValue, 'dd/MM/yyyy', { locale: id });
};

export const formatDateServer = (date: number | string | Date) => {
  if (!date) return '-'

  const formatValue = typeof date === 'string' ? new Date(date) : date;

  return format(formatValue, 'yyyy-MM-dd', { locale: id });
};

export const formatDateTime = (date: number | string | Date) => {
  const formatValue = typeof date === 'string' ? new Date(date) : date;

  return format(formatValue, 'dd/MM/yyyy HH:mm', { locale: id });
};

export const getCurrentDate = () => format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id });

export const parseDateObject = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

export const parseDateType = (date: any) => {
  return new Date(date.year, date.month - 1, date.day)
}

export const formatDateObject = (date: any) => {
  return format(new Date(date.year, date.month - 1, date.day), 'dd/MM/yyyy', { locale: id })
}
export const parseISODate = (date: any) => {
  return parseISO(date)
}

export const formatDateInd = (isoString:string) => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('id-ID', options);
};

export const formatDateIndLong = (isoString:string) => {
  if (!isoString) return '-';

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('id-ID', options);
};




export function getDifferenceInDays(date1:number, date2:number) {
  const oneDay = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik
  const diffInTime = Math.abs(date2 - date1); // Selisih waktu dalam milidetik
  const diffInDays = Math.round(diffInTime / oneDay); // Selisih hari bulat
  return diffInDays;
}
