"use client";

import React, { useState, useEffect } from 'react';
import { CalculatorInputs, CalculationResults } from '../lib/types';
import { performCalculations } from '../lib/calculations';
import Hero from '../components/Hero';
import Presets from '../components/Presets';
import CalculatorForm from '../components/CalculatorForm';
import ResultsDisplay from '../components/ResultsDisplay';
import RecommendationSummary from '../components/RecommendationSummary';
import AssumptionsAndDisclaimer from '../components/AssumptionsAndDisclaimer';

const INITIAL_INPUTS: CalculatorInputs = {
  vehiclePrice: 45000,
  downPayment: 5000,
  tradeInValue: 0,
  salesTaxPercent: 13, // Default for Ontario
  financeApr: 6.45,
  financeTermMonths: 60,
  leaseApr: 4.99,
  leaseTermMonths: 48, // Typical lease term
  residualPercent: 55,
  insurancePerMonth: 150,
  maintenancePerYear: 800,
  estimatedResaleValue: 20000, // Guess for 5yr old car
  vehicleType: 'gas',
  monthlyKilometers: 1500,
  phevRangeKm: 50,
  gasPricePerLiter: 1.50,
  elecPricePerKwh: 0.14,
};

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS);
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    // Recalculate whenever inputs change
    const newResults = performCalculations(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyPreset = (updates: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative z-10">
            <Presets onApplyPreset={handleApplyPreset} />
            <CalculatorForm inputs={inputs} onChange={handleInputChange} />
          </div>

          <div className="lg:col-span-5 relative z-10 sticky top-8 flex flex-col gap-6">
            {results && (
              <>
                <ResultsDisplay results={results} inputs={inputs} />
                <RecommendationSummary results={results} inputs={inputs} />
              </>
            )}
          </div>
          
        </div>
      </div>
      
      <AssumptionsAndDisclaimer />
    </main>
  );
}
