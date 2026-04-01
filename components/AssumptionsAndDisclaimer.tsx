export default function AssumptionsAndDisclaimer() {
  return (
    <div className="bg-gray-50 py-12 px-6 lg:px-8 mt-16 rounded-xl border border-gray-100 max-w-7xl mx-auto mb-16">
      <div className="mx-auto max-w-4xl text-sm text-gray-500">
        <h3 className="font-semibold text-gray-900 mb-4 text-base">Assumptions & Legal Disclaimer</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Interest Rates:</strong> Can vary significantly by specific car model, personal credit score, and dealership promotions.</li>
          <li><strong>Residual Values:</strong> Set strictly by the vehicle manufacturer or leasing company and vary widely by make and model.</li>
          <li><strong>Taxes:</strong> Sales taxes vary across Canadian provinces. This calculator assumes applying the given sales tax to the total finance amount or lease monthly payments based on typical Canadian models.</li>
          <li><strong>Maintenance & Insurance:</strong> The values provided are estimated averages and your actual costs will differ based on location, age, and driving history.</li>
        </ul>
        <p className="text-xs border-t border-gray-200 pt-4">
          Disclaimer: This calculator is provided for informational and educational purposes only and should not be considered financial advice. 
          Real-world numbers at a dealership will include freight, PDI, air conditioning tax, tire tax, varied dealership administration fees, and exact provincial tax calculations which can slightly alter the final total cost. Always review standard contract terms carefully.
        </p>
      </div>
    </div>
  )
}
