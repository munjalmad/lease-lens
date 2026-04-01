export interface CalculatorInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  financeApr: number;
  financeTermMonths: number;
  leaseApr: number;
  leaseTermMonths: number;
  residualPercent: number;
  insurancePerMonth: number;
  maintenancePerYear: number;
  estimatedResaleValue: number;
  // New EV/Energy properties
  vehicleType: 'gas' | 'hybrid' | 'phev' | 'ev';
  monthlyKilometers: number;
  phevRangeKm: number;
  gasPricePerLiter: number;
  elecPricePerKwh: number;
}

export interface CalculationResults {
  financeMonthlyPayment: number;
  leaseMonthlyPayment: number;
  financeTotalPaid: number;
  leaseTotalPaid: number;
  financeTotalOwnershipCost: number;
  leaseTotalOwnershipCost: number;
  financeNetOwnershipCost: number;
  leaseNetOwnershipCost: number;
  // New Energy results
  monthlyEnergyCost: number;
  totalEnergyCostFinance: number;
  totalEnergyCostLease: number;
  gasCounterpartEnergyCost: number; // to calculate savings
}
