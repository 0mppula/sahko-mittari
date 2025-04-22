import { z } from 'zod';

export const formSchema = z.object({
	voltage: z.coerce
		.number({
			required_error: 'Voltage is required',
			invalid_type_error: 'Voltage has to be a positive number',
		})
		.min(0, {
			message: `Voltage cannot be negative`,
		}),
	voltageUnit: z.string(),
	current: z.coerce
		.number({
			required_error: 'Current is required',
			invalid_type_error: 'Current has to be a positive number',
		})
		.min(0, {
			message: `Current cannot be negative`,
		}),
	currentUnit: z.string(),
	power: z.coerce
		.number({
			required_error: 'Power is required',
			invalid_type_error: 'Power has to be a positive number',
		})
		.min(0, {
			message: `Power cannot be negative`,
		}),
	powerUnit: z.string(),
});

export const resultsFormSchema = z.object({
	multiplier: z.number(),
});
