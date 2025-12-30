export default function StudentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Students
        </h2>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Add Student
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-8 text-center text-gray-500">
          Student list will be displayed here
        </div>
      </div>
    </div>
  );
}

