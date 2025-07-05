import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-400 mb-4">
          👨‍💼 Admin Dashboard
        </h1>
        <p className="text-xl text-white mb-8">
          Young Circle Empire Admin Portal
        </p>
        <div className="bg-black/50 border border-amber-500/30 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-amber-400 mb-4">Coming Soon</h2>
          <p className="text-gray-300 mb-6">
            This admin dashboard is currently under development. 
            It will provide comprehensive management tools for:
          </p>
          <ul className="text-left text-gray-300 space-y-2 mb-6">
            <li>• Booking management</li>
            <li>• User administration</li>
            <li>• Analytics & reporting</li>
            <li>• System configuration</li>
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
