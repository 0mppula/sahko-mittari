'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const voltageUnitValues = [
	{ value: 'mV', label: 'Millivolts', multiplier: 1_000 },
	{ value: 'V', label: 'Volts', multiplier: 1 },
	{ value: 'kV', label: 'Kilovolts', multiplier: 0.001 },
	{ value: 'MV', label: 'Megavolts', multiplier: 0.000_001 },
	{ value: 'GV', label: 'Gigavolts', multiplier: 0.000_000_001 },
] as const;

export const currentUnitValues = [
	{ value: 'A', label: 'Amperes', multiplier: 1 },
	{ value: 'mA', label: 'Milliamperes', multiplier: 1_000 },
	{ value: 'µA', label: 'Microamperes', multiplier: 1_000_000 },
] as const;

export const powerUnitValues = [
	{ value: 'pW', label: 'Picowatts', multiplier: 1_000_000_000_000 },
	{ value: 'nW', label: 'Nanowatts', multiplier: 1_000_000_000 },
	{ value: 'µW', label: 'Microwatts', multiplier: 1_000_000 },
	{ value: 'mW', label: 'Milliwatts', multiplier: 1_000 },
	{ value: 'W', label: 'Watts', multiplier: 1 },
	{ value: 'kW', label: 'Kilowatts', multiplier: 0.001 },
	{ value: 'MW', label: 'Megawatts', multiplier: 0.000_001 },
	{ value: 'GW', label: 'Gigawatts', multiplier: 0.000_000_001 },
	{ value: 'TW', label: 'Terawatts', multiplier: 0.000_000_000_001 },
] as const;

export type VoltageUnit = (typeof voltageUnitValues)[number]['value'];
export type VoltageUnitLabel = (typeof voltageUnitValues)[number]['label'];

export type CurrentUnit = (typeof currentUnitValues)[number]['value'];
export type CurrentUnitLabel = (typeof currentUnitValues)[number]['label'];

export type PowerUnit = (typeof powerUnitValues)[number]['value'];
export type PowerUnitLabel = (typeof powerUnitValues)[number]['label'];

const formSchema = z.object({
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

const Calculator = () => {
	const [calcMode, setCalcMode] = useState<'power' | 'current' | 'voltage'>('power');
	const [isCalculated, setIsCalculated] = useState(false);
	const [result, setResult] = useState({
		value: 0,
		unit: '',
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			voltage: 0,
			current: 0,
			power: 0,
			voltageUnit: 'V',
			currentUnit: 'A',
			powerUnit: 'W',
		},
	});

	const {
		formState: { errors },
	} = form;

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// V = voltage in volts (V) or P / I
		// I  = current in amps (A) or P / V
		// P = power in watts (W) or I * V
		const { current, power, voltage, voltageUnit } = values;

		const V = isFinite(power / current) ? power / current : 0;
		const I = isFinite(power / voltage) ? power / voltage : 0;
		const P = current * voltage;

		setIsCalculated(true);

		if (calcMode === 'power')
			setResult({
				value: P,
				unit: voltageUnit,
			});

		return { V, I, P };
	};

	const handleFormReset = () => {
		form.reset();
		setIsCalculated(false);
	};

	const isFieldEmpty = (e: React.FocusEvent<HTMLInputElement>) => {
		return e.target.value === '';
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<Tabs
						defaultValue="account"
						className="w-full"
						onValueChange={(e) => {
							setCalcMode(e as 'power' | 'current' | 'voltage');
							form.reset();
							setIsCalculated(false);
						}}
						value={calcMode}
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="power">Power</TabsTrigger>
							<TabsTrigger value="voltage">Voltage</TabsTrigger>
							<TabsTrigger value="current">Current</TabsTrigger>
						</TabsList>
					</Tabs>

					<h2 className="my-2 scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0">
						Calculate the {calcMode}
					</h2>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* VOLTAGE FIELD */}
							{calcMode !== 'voltage' && (
								<div className="flex gap-2 flex-wrap">
									<FormField
										control={form.control}
										name="voltage"
										render={({ field }) => (
											<FormItem className="w-full shrink grow basis-32">
												<FormLabel>Voltage (V)</FormLabel>

												<FormControl>
													<Input
														className="w-full"
														{...field}
														placeholder="2"
														type="number"
														min={0}
														onBlur={(e) =>
															isFieldEmpty(e) &&
															form.setValue('voltage', 0)
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="voltageUnit"
										render={({ field }) => (
											<FormItem className="self-end w-full shrink grow basis-32">
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{voltageUnitValues.map((u, i) => (
															<SelectItem
																key={`${u.value}-${i}`}
																value={u.value}
															>
																{u.label} ({u.value})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									{errors.voltage && (
										<FormMessage className="w-full order-1">
											{errors.voltage.message}
										</FormMessage>
									)}
								</div>
							)}

							{/* CURRENT FIELD */}
							{calcMode !== 'current' && (
								<div className="flex gap-2 flex-wrap">
									<FormField
										control={form.control}
										name="current"
										render={({ field }) => (
											<FormItem className="w-full shrink grow basis-32">
												<FormLabel>Current (I)</FormLabel>

												<FormControl>
													<Input
														className="w-full"
														{...field}
														placeholder="2"
														type="number"
														min={0}
														onBlur={(e) =>
															isFieldEmpty(e) &&
															form.setValue('current', 0)
														}
													/>
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="currentUnit"
										render={({ field }) => (
											<FormItem className="self-end w-full shrink grow basis-32">
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{currentUnitValues.map((u, i) => (
															<SelectItem
																key={`${u.value}-${i}`}
																value={u.value}
															>
																{u.label} ({u.value})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									{errors.current && (
										<FormMessage className="w-full order-1">
											{errors.current.message}
										</FormMessage>
									)}
								</div>
							)}

							{/* POWER FIELD */}
							{calcMode !== 'power' && (
								<div className="flex gap-2 flex-wrap">
									<FormField
										control={form.control}
										name="power"
										render={({ field }) => (
											<FormItem className="w-full shrink grow basis-32">
												<FormLabel>Power (P)</FormLabel>

												<FormControl>
													<Input
														className="w-full"
														{...field}
														placeholder="2"
														type="number"
														min={0}
														onBlur={(e) =>
															isFieldEmpty(e) &&
															form.setValue('power', 0)
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="powerUnit"
										render={({ field }) => (
											<FormItem className="self-end w-full shrink grow basis-32">
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{powerUnitValues.map((u, i) => (
															<SelectItem
																key={`${u.value}-${i}`}
																value={u.value}
															>
																{u.label} ({u.value})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>

									{errors.power && (
										<FormMessage className="w-full order-1">
											{errors.power.message}
										</FormMessage>
									)}
								</div>
							)}

							<div className="mt-6 flex gap-4 mr-auto justify-end flex-wrap">
								<Button variant="secondary" type="button" onClick={handleFormReset}>
									Reset
								</Button>

								<Button type="submit">Calculate</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{isCalculated && (
				<div className="w-full space-y-4 mt-2">
					<div className="w-full flex gap-4 justify-between items-center">
						<Separator className="my-4 flex-1" />

						<h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							Result
						</h2>

						<Separator className="my-4 flex-1" />
					</div>

					<div>
						<Input value={result.value} type="number" readOnly />
					</div>
				</div>
			)}
		</>
	);
};

export default Calculator;
