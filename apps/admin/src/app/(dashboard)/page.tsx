export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Students
          </h3>
          <p className="text-gray-600">Manage student profiles</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Progress
          </h3>
          <p className="text-gray-600">Track student progress</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Settings
          </h3>
          <p className="text-gray-600">Configure system settings</p>
        </div>
      </div>
    </div>
  );
}

