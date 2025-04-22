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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUnitValues, powerUnitValues, voltageUnitValues } from '@/constants';
import { calcMagnitudeChange, round } from '@/lib/utils';
import { formSchema, resultsFormSchema } from '@/schemas';
import { calcModeType, CurrentUnit, PowerUnit, VoltageUnit } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ControllerRenderProps, Path, useForm } from 'react-hook-form';
import { z } from 'zod';
import Results from './Results';

const Calculator = () => {
	const [calcMode, setCalcMode] = useState<calcModeType>('power');
	const [isCalculated, setIsCalculated] = useState(false);
	const [result, setResult] = useState(0);

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

	const resultsForm = useForm<z.infer<typeof resultsFormSchema>>({
		resolver: zodResolver(resultsFormSchema),
		defaultValues: { multiplier: 1 },
	});

	const resultsMultiplier = resultsForm.watch('multiplier');

	const {
		formState: { errors },
	} = form;

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// V = voltage in volts (V) or P / I
		// I  = current in amps (A) or P / V
		// P = power in watts (W) or I * V
		const { current, power, voltage, voltageUnit, currentUnit, powerUnit } = values;

		// Units normalized to base units eg. 1kW -> 1000W
		const voltageMultip = voltageUnitValues.find((u) => u.value === voltageUnit)
			?.multiplier as number;
		const currentMultip = currentUnitValues.find((u) => u.value === currentUnit)
			?.multiplier as number;
		const powerMultip = powerUnitValues.find((u) => u.value === powerUnit)
			?.multiplier as number;

		const VoltageN = voltage / voltageMultip;
		const CurrentN = current / currentMultip;
		const powerN = power / powerMultip;

		const V = isFinite(powerN / CurrentN) ? powerN / CurrentN : 0;
		const I = isFinite(powerN / VoltageN) ? powerN / VoltageN : 0;
		const P = CurrentN * VoltageN;

		setIsCalculated(true);

		if (calcMode === 'power') {
			setResult(P);
		}

		if (calcMode === 'voltage') {
			setResult(V);
		}

		if (calcMode === 'current') {
			setResult(I);
		}

		return { V, I, P };
	};

	const handleFormReset = () => {
		form.reset();
		setIsCalculated(false);
	};

	const handleSelectChange = (
		val: VoltageUnit | CurrentUnit | PowerUnit,
		field: ControllerRenderProps<z.infer<typeof formSchema>>,
		fieldName: Path<z.infer<typeof formSchema>>,
		multipliedField: Path<z.infer<typeof formSchema>>,
		unitsDataArray: typeof voltageUnitValues | typeof currentUnitValues | typeof powerUnitValues
	) => {
		const newMultip = unitsDataArray.find((v) => v.value === val)?.multiplier as number;
		const oldMultip = unitsDataArray.find((v) => v.value === form.getValues(fieldName))
			?.multiplier as number;

		const originalVal = form.getValues(multipliedField) as number;
		const newValCoefficient = Math.pow(10, calcMagnitudeChange(oldMultip, newMultip));

		form.setValue(multipliedField, round(newValCoefficient * originalVal));

		field.onChange(val);
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
							resultsForm.setValue('multiplier', 1);
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
													onValueChange={(val: VoltageUnit) =>
														handleSelectChange(
															val,
															field,
															'voltageUnit',
															'voltage',
															voltageUnitValues
														)
													}
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
													onValueChange={(val: CurrentUnit) =>
														handleSelectChange(
															val,
															field,
															'currentUnit',
															'current',
															currentUnitValues
														)
													}
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
													onValueChange={(val: PowerUnit) =>
														handleSelectChange(
															val,
															field,
															'powerUnit',
															'power',
															powerUnitValues
														)
													}
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
				<Results
					form={form}
					resultsForm={resultsForm}
					result={result}
					resultsMultiplier={resultsMultiplier}
					calcMode={calcMode}
				/>
			)}
		</>
	);
};

export default Calculator;
