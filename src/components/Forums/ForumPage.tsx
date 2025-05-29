import DiscussionDetail from "@/components/Forums/DiscussionDetails";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function DiscussionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Discussion Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center space-y-1 min-w-[60px]">
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <ArrowUp className="w-5 h-5" />
              </button>
              <span className="font-semibold text-green-600">24</span>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  🔥 Hot
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Computer Science
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Best strategies for learning React Hooks effectively?
              </h1>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                I've been struggling with understanding useEffect and
                useCallback. What are some practical exercises or projects that
                helped you master these concepts? I've read the documentation
                multiple times but I'm having trouble applying the concepts in
                real-world scenarios.
              </p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Sarah Chen"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-gray-900">Sarah Chen</span>
                  <span className="text-sm text-gray-500">1,250 rep</span>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <DiscussionDetail />
      </div>
    </div>
  );
}
