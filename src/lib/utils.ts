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

export const round = (val: number, decimals: number = 12) => {
	return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
