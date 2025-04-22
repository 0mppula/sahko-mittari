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
	power: z.coerce
		.number({
			required_error: 'Power is required',
			invalid_type_error: 'Power has to be a positive number',
		})
		.min(0, {
			message: `Power cannot be negative`,
		}),
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
		},
	});

	const {
		formState: { errors },
	} = form;

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// V = voltage in volts (V) or P / I
		// I  = current in amps (A) or P / V
		// P = power in watts (W) or I * V
		const { current, power, voltage } = values;

		const V = isFinite(power / current) ? power / current : 0;
		const I = isFinite(power / voltage) ? power / voltage : 0;
		const P = current * voltage;

		setIsCalculated(true);

		if (calcMode === 'power')
			setResult({
				value: P,
				unit: '',
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
														className="flex-1"
														{...field}
														placeholder="2"
														type="number"
														// min={0}
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
														<SelectItem value="mV">
															Millivolts (mV)
														</SelectItem>
														<SelectItem value="V">Volts (V)</SelectItem>
														<SelectItem value="kV">
															Kilovolts (kV)
														</SelectItem>
														<SelectItem value="MV">
															Megavolts (MV)
														</SelectItem>
														<SelectItem value="GV">
															Gigavolts (GV)
														</SelectItem>
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
