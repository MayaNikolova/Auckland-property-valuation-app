import PropertyValuationCalculator from "./components/PropertyValuationCalculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Auckland Property Valuation Calculator</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Professional property valuation using multi-source Auckland market data from REINZ, CoreLogic, QV, OneRoof,
            and RBNZ
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Historical Data 1980-2024</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">5 Major Sources</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Suburb Reports</span>
          </div>
        </div>
        <PropertyValuationCalculator />
      </div>
    </main>
  )
}
