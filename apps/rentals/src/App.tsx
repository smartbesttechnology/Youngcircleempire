import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-400 mb-4">
          📹 Equipment Rentals
        </h1>
        <p className="text-xl text-white mb-8">
          Young Circle Empire Rental System
        </p>
        <div className="bg-black/50 border border-teal-500/30 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-teal-400 mb-4">Coming Soon</h2>
          <p className="text-gray-300 mb-6">
            This rental system is currently under development. 
            It will provide equipment rental services for:
          </p>
          <ul className="text-left text-gray-300 space-y-2 mb-6">
            <li>• Professional cameras</li>
            <li>• Audio equipment</li>
            <li>• Lighting gear</li>
            <li>• Studio accessories</li>
          </ul>
          <div className="text-sm text-gray-400">
            Part of YC Empire Monorepo
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
