import { currentUnitValues, powerUnitValues, voltageUnitValues } from '@/constants';

export type VoltageUnit = (typeof voltageUnitValues)[number]['value'];
export type CurrentUnit = (typeof currentUnitValues)[number]['value'];
export type PowerUnit = (typeof powerUnitValues)[number]['value'];

export type calcModeType = 'voltage' | 'current' | 'power';
