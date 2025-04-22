import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { currentUnitValues, powerUnitValues, voltageUnitValues } from '@/constants';
import { round } from '@/lib/utils';
import { formSchema, resultsFormSchema } from '@/schemas';
import { calcModeType } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface ResultsProps {
	form: UseFormReturn<z.infer<typeof formSchema>>;
	resultsForm: UseFormReturn<z.infer<typeof resultsFormSchema>>;
	result: number;
	resultsMultiplier: number;
	calcMode: calcModeType;
}

const Results = ({ form, resultsForm, result, resultsMultiplier, calcMode }: ResultsProps) => {
	return (
		<div className="w-full space-y-4 mt-2">
			<div className="w-full flex gap-4 justify-between items-center">
				<Separator className="my-4 flex-1" />

				<h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Result</h2>

				<Separator className="my-4 flex-1" />
			</div>

			<div className="flex gap-2 flex-wrap">
				<Input
					className="w-full shrink grow basis-32"
					value={round(result * Number(resultsMultiplier))}
					type="number"
					readOnly
				/>

				<Form {...form}>
					<form className="w-full shrink grow basis-32">
						<FormField
							control={resultsForm.control}
							name="multiplier"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={String(field.value)}
									>
										<FormControl>
											<SelectTrigger className="w-full shrink grow basis-32">
												<SelectValue />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{calcMode == 'power' &&
												powerUnitValues.map((u, i) => (
													<SelectItem
														key={`${u.value}-${i}-res`}
														value={String(u.multiplier)}
													>
														{u.label} ({u.value})
													</SelectItem>
												))}

											{calcMode == 'voltage' &&
												voltageUnitValues.map((u, i) => (
													<SelectItem
														key={`${u.value}-${i}-res`}
														value={String(u.multiplier)}
													>
														{u.label} ({u.value})
													</SelectItem>
												))}

											{calcMode == 'current' &&
												currentUnitValues.map((u, i) => (
													<SelectItem
														key={`${u.value}-${i}-res`}
														value={String(u.multiplier)}
													>
														{u.label} ({u.value})
													</SelectItem>
												))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Results;
