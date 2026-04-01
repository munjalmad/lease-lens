import { CalculatorInputs, CalculationResults } from './types';

export function calculateAmortizedPayment(principal: number, apr: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  // M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Number.isNaN(payment) ? 0 : payment;
}

export function calculateLeasePayment(
  capitalizedCost: number, 
  residualValue: number, 
  apr: number, 
  termMonths: number
): number {
  if (capitalizedCost <= 0 || termMonths <= 0) return 0;
  const moneyFactor = apr / 100 / 2400; // Standard approximation or conversion
  
  // Depreciation = (Cap Cost - Residual) / Term
  const depreciationFee = (capitalizedCost - residualValue) / termMonths;
  
  // Rent Charge = (Cap Cost + Residual) * Money Factor
  const rentCharge = (capitalizedCost + residualValue) * moneyFactor;
  
  const payment = depreciationFee + rentCharge;
  return Number.isNaN(payment) ? 0 : payment;
}

export function performCalculations(inputs: CalculatorInputs): CalculationResults {
  // Taxes are typically applied to the price in Finance, and to the monthly payment in Lease (in Canada).
  // For simplicity based on prompt, we assume sales tax applies to vehicle price (minus trade-in) for finance.
  // We'll apply tax properly to get an accurate representation.
  const taxRate = inputs.salesTaxPercent / 100;
  const initialCapReduction = inputs.downPayment + inputs.tradeInValue;

  // --- Energy Calculations ---
  // Base constants
  const GAS_L_PER_100KM = 8.5;
  const HYBRID_L_PER_100KM = 5.5;
  const EV_KWH_PER_100KM = 18;
  const DAYS_PER_MONTH = 30.4;

  let monthlyEnergyCost = 0;
  const gasCounterpartCost = (inputs.monthlyKilometers / 100) * GAS_L_PER_100KM * inputs.gasPricePerLiter;

  switch (inputs.vehicleType) {
    case 'gas':
      monthlyEnergyCost = gasCounterpartCost;
      break;
    case 'hybrid':
      monthlyEnergyCost = (inputs.monthlyKilometers / 100) * HYBRID_L_PER_100KM * inputs.gasPricePerLiter;
      break;
    case 'ev':
      monthlyEnergyCost = (inputs.monthlyKilometers / 100) * EV_KWH_PER_100KM * inputs.elecPricePerKwh;
      break;
    case 'phev':
      const maxEvKmPerMonth = inputs.phevRangeKm * DAYS_PER_MONTH;
      const evKm = Math.min(inputs.monthlyKilometers, maxEvKmPerMonth);
      const gasKm = Math.max(0, inputs.monthlyKilometers - evKm);
      const electricCost = (evKm / 100) * EV_KWH_PER_100KM * inputs.elecPricePerKwh;
      const phevGasCost = (gasKm / 100) * HYBRID_L_PER_100KM * inputs.gasPricePerLiter;
      monthlyEnergyCost = electricCost + phevGasCost;
      break;
  }

  // --- Finance Math ---
  const financePricePreTax = Math.max(0, inputs.vehiclePrice - inputs.tradeInValue);
  const financeTaxAmount = financePricePreTax * taxRate;
  const financeTotalLoanAmount = Math.max(0, financePricePreTax + financeTaxAmount - inputs.downPayment);
  
  const financeMonthlyPayment = calculateAmortizedPayment(financeTotalLoanAmount, inputs.financeApr, inputs.financeTermMonths);
  const financeTotalPaid = initialCapReduction + (financeMonthlyPayment * inputs.financeTermMonths);
  
  // Running costs
  const financeMaintenanceTotal = (inputs.maintenancePerYear / 12) * inputs.financeTermMonths;
  const financeInsuranceTotal = inputs.insurancePerMonth * inputs.financeTermMonths;
  const totalEnergyCostFinance = monthlyEnergyCost * inputs.financeTermMonths;
  const financeTotalOwnershipCost = financeTotalPaid + financeMaintenanceTotal + financeInsuranceTotal + totalEnergyCostFinance;
  
  const financeNetOwnershipCost = financeTotalOwnershipCost - inputs.estimatedResaleValue;

  // --- Lease Math ---
  // In Canada, lease payments are taxed monthly. Capitalized cost is the agreed upon value.
  const leaseCapCost = inputs.vehiclePrice - initialCapReduction;
  const residualValue = inputs.vehiclePrice * (inputs.residualPercent / 100);
  
  const leaseBaseMonthlyPayment = calculateLeasePayment(leaseCapCost, residualValue, inputs.leaseApr, inputs.leaseTermMonths);
  const leaseMonthlyPaymentWithTax = leaseBaseMonthlyPayment * (1 + taxRate);
  
  // Often there's taxes on downpayment/trade-in for lease, we'll simplify and say total paid includes initial reduction + payments
  const leaseTotalPaid = initialCapReduction + (leaseMonthlyPaymentWithTax * inputs.leaseTermMonths);
  
  const leaseMaintenanceTotal = (inputs.maintenancePerYear / 12) * inputs.leaseTermMonths;
  const leaseInsuranceTotal = inputs.insurancePerMonth * inputs.leaseTermMonths;
  const totalEnergyCostLease = monthlyEnergyCost * inputs.leaseTermMonths;
  const leaseTotalOwnershipCost = leaseTotalPaid + leaseMaintenanceTotal + leaseInsuranceTotal + totalEnergyCostLease;
  
  // Assuming lease is returned, so no resale value equity unless residual is artificially low. We'll assume strict return for 'Net'.
  const leaseNetOwnershipCost = leaseTotalOwnershipCost; // No equity from resale.

  return {
    financeMonthlyPayment,
    leaseMonthlyPayment: leaseMonthlyPaymentWithTax,
    financeTotalPaid,
    leaseTotalPaid,
    financeTotalOwnershipCost,
    leaseTotalOwnershipCost,
    financeNetOwnershipCost,
    leaseNetOwnershipCost,
    monthlyEnergyCost,
    totalEnergyCostFinance,
    totalEnergyCostLease,
    gasCounterpartEnergyCost: gasCounterpartCost
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
}
