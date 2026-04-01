import { CalculatorInputs, CalculationResults } from '../lib/types';
import { formatCurrency } from '../lib/calculations';

interface Props {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export default function RecommendationSummary({ results, inputs }: Props) {
  // Determine winners
  const lowestMonthly = results.leaseMonthlyPayment < results.financeMonthlyPayment ? 'Lease' : 'Buy';
  const monthlyDifference = Math.abs(results.leaseMonthlyPayment - results.financeMonthlyPayment);
  
  const lowestTotalLongTerm = results.leaseTotalOwnershipCost < results.financeTotalOwnershipCost ? 'Lease' : 'Buy';
  
  // Assuming buying is generally better for equity/ownership in the long term, unless residual is terrible
  const betterForOwnership = 'Buy';
  
  const betterForFrequentSwitchers = 'Lease';

  // Deal Quality Logic (2026 Benchmarks)
  const getRateQuality = (apr: number, isFinance: boolean) => {
    if (isFinance) {
      if (apr <= 4.99) return { text: 'Excellent promo rate', color: 'text-green-600 bg-green-50' };
      if (apr <= 6.5) return { text: 'Average market rate', color: 'text-gray-700 bg-gray-100' };
      return { text: 'Higher than average', color: 'text-orange-700 bg-orange-50' };
    } else {
      if (apr <= 3.99) return { text: 'Excellent promo rate', color: 'text-green-600 bg-green-50' };
      if (apr <= 5.5) return { text: 'Average market rate', color: 'text-gray-700 bg-gray-100' };
      return { text: 'Higher than average', color: 'text-orange-700 bg-orange-50' };
    }
  };

  const financeQuality = getRateQuality(inputs.financeApr, true);
  const leaseQuality = getRateQuality(inputs.leaseApr, false);
  
  // 1% Rule for Lease
  const leaseRatio = (results.leaseMonthlyPayment / inputs.vehiclePrice) * 100;
  let leaseValueText = '';
  let leaseValueColor = '';
  if (leaseRatio <= 1.0) {
    leaseValueText = 'Incredible value (< 1% of MSRP)';
    leaseValueColor = 'text-green-700 bg-green-50 font-bold';
  } else if (leaseRatio <= 1.25) {
    leaseValueText = 'Good value (< 1.25% of MSRP)';
    leaseValueColor = 'text-green-700 bg-green-50';
  } else if (leaseRatio <= 1.5) {
    leaseValueText = 'Average value (1.25% - 1.5% of MSRP)';
    leaseValueColor = 'text-gray-700 bg-gray-100';
  } else {
    leaseValueText = 'Poor value (> 1.5% of MSRP)';
    leaseValueColor = 'text-orange-700 bg-orange-50';
  }

  // Energy savings logic
  const energySavingsMonthly = results.gasCounterpartEnergyCost - results.monthlyEnergyCost;

  return (
    <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-blue-500 mr-2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a4.5 4.5 0 0 1 0-8.962L8.5 1.936A2 2 0 0 0 9.937.5l1.582-6.135a4.5 4.5 0 0 1 8.962 0L22.063.5A2 2 0 0 0 23.5 1.937l6.135 1.582a4.5 4.5 0 0 1 0 8.962l-6.135 1.582a2 2 0 0 0-1.437 1.437l-1.582 6.135a4.5 4.5 0 0 1-8.962 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>
        Personalized Recommendation
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Recommendation items */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Lowest Monthly Payment</p>
          <p className="text-lg font-bold text-gray-900">{lowestMonthly} wins</p>
          <p className="text-sm text-gray-600 mt-1">by {formatCurrency(monthlyDifference)}/mo</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Lowest Long-Term Cost</p>
          <p className="text-lg font-bold text-gray-900">{lowestTotalLongTerm} wins</p>
          <p className="text-sm text-gray-600 mt-1">Based on total ownership cost</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Best for Ownership</p>
          <p className="text-lg font-bold text-gray-900">{betterForOwnership}</p>
          <p className="text-sm text-gray-600 mt-1">Build equity over time</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Switch Cars Often?</p>
          <p className="text-lg font-bold text-gray-900">{betterForFrequentSwitchers}</p>
          <p className="text-sm text-gray-600 mt-1">Fewer long-term commitments</p>
        </div>
      </div>

      {inputs.vehicleType !== 'gas' && energySavingsMonthly > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-xl">
          <h4 className="font-semibold text-green-800 text-sm mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Environmental Savings
          </h4>
          <p className="text-sm text-green-700">
            By driving a <span className="uppercase font-bold">{inputs.vehicleType}</span>, you are saving <strong>{formatCurrency(energySavingsMonthly)} per month</strong> in potential energy costs compared to a standard gas car!
          </p>
        </div>
      )}
      
      {/* 2026 Deal Quality Section */}
      <div className="mt-6 pt-6 border-t border-blue-100">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">2026 Market Analysis</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Finance Interest Rate ({inputs.financeApr}%)</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${financeQuality.color}`}>
              {financeQuality.text}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Lease Interest Rate ({inputs.leaseApr}%)</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${leaseQuality.color}`}>
              {leaseQuality.text}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Lease Monthly Value ({leaseRatio.toFixed(2)}%)</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${leaseValueColor}`}>
              {leaseValueText}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-blue-100">
        <p className="text-gray-800 font-medium text-lg leading-relaxed">
          {lowestMonthly === 'Lease' ? `Lease wins on monthly affordability. ` : `Buy wins on monthly affordability. `}
          {lowestTotalLongTerm === 'Buy' ? `Buy wins on long-term value. ` : `Leasing actually saves money long-term here. `}
          Best choice if you keep cars 5+ years: <span className="font-bold text-blue-700">Buy</span>.
        </p>
      </div>
    </div>
  )
}
