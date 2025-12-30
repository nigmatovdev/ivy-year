export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-h2 font-serif font-bold text-primary-900 mb-10 tracking-tight">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="/students"
          className="group bg-white p-8 rounded-2xl border border-ivy-200 shadow-soft hover:shadow-soft-md hover:border-ivy-300 transition-all duration-300"
        >
          <h3 className="text-h4 font-semibold text-primary-900 mb-3 tracking-tight group-hover:text-ivy-900 transition-colors">
            Students
          </h3>
          <p className="text-body text-primary-700 leading-relaxed">Manage student profiles and progress tracking</p>
        </a>
        <div className="bg-white p-8 rounded-2xl border border-ivy-200 shadow-soft">
          <h3 className="text-h4 font-semibold text-primary-900 mb-3 tracking-tight">
            Progress
          </h3>
          <p className="text-body text-primary-700 leading-relaxed">Track student progress and achievements</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-ivy-200 shadow-soft">
          <h3 className="text-h4 font-semibold text-primary-900 mb-3 tracking-tight">
            Settings
          </h3>
          <p className="text-body text-primary-700 leading-relaxed">Configure system settings and preferences</p>
        </div>
      </div>
    </div>
  );
}
