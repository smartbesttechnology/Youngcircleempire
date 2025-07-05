import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-400 mb-4">
          🔗 Smart Links
        </h1>
        <p className="text-xl text-white mb-8">
          Young Circle Empire Link Management
        </p>
        <div className="bg-black/50 border border-purple-500/30 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">Coming Soon</h2>
          <p className="text-gray-300 mb-6">
            This link management system is currently under development. 
            It will provide smart link services for:
          </p>
          <ul className="text-left text-gray-300 space-y-2 mb-6">
            <li>• Custom short links</li>
            <li>• Link analytics</li>
            <li>• QR code generation</li>
            <li>• Social media integration</li>
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
