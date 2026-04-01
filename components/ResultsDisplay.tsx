import React from 'react';
import { CalculatorInputs, CalculationResults } from '../lib/types';
import { formatCurrency } from '../lib/calculations';

interface Props {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export default function ResultsDisplay({ results, inputs }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-xl font-medium text-gray-300 mb-6 flex items-center">
          Monthly Payment Comparison
        </h3>
        <div className="grid grid-cols-2 gap-8 divide-x divide-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Finance</p>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(results.financeMonthlyPayment)}</p>
            <p className="text-xs text-gray-500 mt-2">per month</p>
          </div>
          <div className="pl-8">
            <p className="text-sm font-medium text-gray-400 mb-1">Lease</p>
            <p className="text-4xl font-bold tracking-tight text-blue-400">{formatCurrency(results.leaseMonthlyPayment)}</p>
            <p className="text-xs text-gray-500 mt-2">per month</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Long-Term Breakdown</h3>
        <div className="space-y-6">
          
          <div className="grid grid-cols-3 gap-4 items-center border-b border-gray-50 pb-4">
            <div className="text-sm text-gray-500">Total Cash Paid</div>
            <div className="text-right font-medium text-gray-900">{formatCurrency(results.financeTotalPaid)}</div>
            <div className="text-right font-medium text-blue-600">{formatCurrency(results.leaseTotalPaid)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center border-b border-gray-50 pb-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Energy & Commute</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{inputs.vehicleType}</span>
            </div>
            <div className="text-right font-medium text-gray-500">+{formatCurrency(results.totalEnergyCostFinance)}</div>
            <div className="text-right font-medium text-blue-400">+{formatCurrency(results.totalEnergyCostLease)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center border-b border-gray-50 pb-4">
            <div className="text-sm text-gray-500 leading-tight">Total TCO<br/><span className="text-[10px]">(Inc. Energy/Maint/Ins)</span></div>
            <div className="text-right font-medium text-gray-900">{formatCurrency(results.financeTotalOwnershipCost)}</div>
            <div className="text-right font-medium text-blue-600">{formatCurrency(results.leaseTotalOwnershipCost)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center bg-gray-50 p-4 rounded-xl">
            <div className="text-sm font-semibold text-gray-900">Net Final Cost<br/><span className="text-xs font-normal text-gray-500">(After Equity/Resale)</span></div>
            <div className="text-right font-bold text-gray-900 text-lg">{formatCurrency(results.financeNetOwnershipCost)}</div>
            <div className="text-right font-bold text-blue-600 text-lg">{formatCurrency(results.leaseNetOwnershipCost)}</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
