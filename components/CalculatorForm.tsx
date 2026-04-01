import React from 'react';
import { CalculatorInputs } from '../lib/types';

interface Props {
  inputs: CalculatorInputs;
  onChange: (field: keyof CalculatorInputs, value: any) => void;
}

interface InputGroupProps {
  label: string;
  field: keyof CalculatorInputs;
  value: number;
  onChange: (field: keyof CalculatorInputs, value: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: 'currency' | 'percent' | 'months' | 'km';
}

const InputGroup = ({ label, field, value, onChange, placeholder, icon = '$', type = 'currency' }: InputGroupProps) => {
  return (
    <div>
      <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative rounded-xl shadow-sm">
        {type === 'currency' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          type="number"
          name={field}
          id={field}
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            const parsed = parseFloat(val);
            onChange(field, isNaN(parsed) ? 0 : parsed);
          }}
          className={`block w-full rounded-xl border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6
            ${type === 'currency' ? 'pl-8' : 'pl-4'}
            ${type !== 'currency' ? 'pr-12' : 'pr-10'} bg-gray-50/50 hover:bg-white transition-colors`}
          placeholder={placeholder || '0'}
        />
        {type === 'percent' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-500 sm:text-sm">%</span>
          </div>
        )}
        {type === 'months' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-500 sm:text-sm">mo</span>
          </div>
        )}
        {type === 'km' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-500 sm:text-sm">km</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CalculatorForm({ inputs, onChange }: Props) {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
          Vehicle Details
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <InputGroup label="Vehicle Price (MSRP)" field="vehiclePrice" value={inputs.vehiclePrice} onChange={onChange} />
          <InputGroup label="Sales Tax (Provincial)" field="salesTaxPercent" type="percent" value={inputs.salesTaxPercent} onChange={onChange} />
          <InputGroup label="Down Payment" field="downPayment" value={inputs.downPayment} onChange={onChange} />
          <InputGroup label="Trade-in Value" field="tradeInValue" value={inputs.tradeInValue} onChange={onChange} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
          Energy & Powertrain
        </h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['gas', 'hybrid', 'phev', 'ev'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onChange('vehicleType', type)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize
                  ${inputs.vehicleType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {type === 'phev' ? 'PHEV' : type === 'ev' ? 'EV' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 mt-4">
          <InputGroup label="Average Driving (Monthly)" field="monthlyKilometers" type="km" icon="" placeholder="1500" value={inputs.monthlyKilometers} onChange={onChange} />
          {inputs.vehicleType === 'phev' && (
            <InputGroup label="PHEV Electric Range (Per Charge)" field="phevRangeKm" type="km" icon="" placeholder="50" value={inputs.phevRangeKm} onChange={onChange} />
          )}
          
          {(inputs.vehicleType === 'gas' || inputs.vehicleType === 'hybrid' || inputs.vehicleType === 'phev') && (
            <InputGroup label="Gas Price ($/Liter)" field="gasPricePerLiter" value={inputs.gasPricePerLiter} onChange={onChange} />
          )}
          
          {(inputs.vehicleType === 'ev' || inputs.vehicleType === 'phev') && (
            <InputGroup label="Electricity Rate ($/kWh)" field="elecPricePerKwh" value={inputs.elecPricePerKwh} onChange={onChange} />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
          Finance & Lease Terms
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <InputGroup label="Finance APR" field="financeApr" type="percent" value={inputs.financeApr} onChange={onChange} />
          <InputGroup label="Finance Term" field="financeTermMonths" type="months" value={inputs.financeTermMonths} onChange={onChange} />
          <div className="col-span-1 sm:col-span-2 py-2">
           <hr className="border-gray-50" />
          </div>
          <InputGroup label="Lease APR" field="leaseApr" type="percent" value={inputs.leaseApr} onChange={onChange} />
          <InputGroup label="Lease Term" field="leaseTermMonths" type="months" value={inputs.leaseTermMonths} onChange={onChange} />
          <InputGroup label="Lease Residual Value" field="residualPercent" type="percent" value={inputs.residualPercent} onChange={onChange} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
          Other Ownership Costs
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <InputGroup label="Insurance (Monthly)" field="insurancePerMonth" value={inputs.insurancePerMonth} onChange={onChange} />
          <InputGroup label="Maintenance (Yearly)" field="maintenancePerYear" value={inputs.maintenancePerYear} onChange={onChange} />
          <div className="col-span-1 sm:col-span-2">
            <InputGroup label="Est. Resale Value (If bought)" field="estimatedResaleValue" value={inputs.estimatedResaleValue} onChange={onChange} />
            <p className="mt-2 text-xs text-gray-500">Value of the car at the end of the term. Enter $0 if you plan to keep it forever or don't care about equity.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
