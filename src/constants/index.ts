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
