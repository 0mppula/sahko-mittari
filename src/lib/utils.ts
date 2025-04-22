import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const calcMagnitudeChange = (from: number, to: number) => {
	const logFrom = Math.log10(Math.abs(from));
	const logTo = Math.log10(Math.abs(to));

	return Math.floor(logTo) - Math.floor(logFrom);
};

export const getDecimalPlaces = (value: number): number => {
	const str = value.toString();
	const decimalIndex = str.indexOf('.');
	return decimalIndex >= 0 ? str.length - decimalIndex - 1 : 0;
};

export const round = (val: number, decimals: number = 3) => {
	return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
