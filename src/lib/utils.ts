import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  if (value >= 10000000) return '₹' + (value / 10000000).toFixed(2) + ' Cr';
  if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + ' L';
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

export function formatCurrencyShort(value: number) {
  if (value >= 10000000) return (value / 10000000).toFixed(1) + 'Cr';
  if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
  if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
  return Math.round(value).toString();
}
