// Popup.js
import { AlertTriangle } from "lucide-react";

export default function Popup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        <div className="p-6 sm:p-8">
          <div className="flex items-start">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-inter">
                Heads Up! Ongoing Development
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed">
                The website is in continuous construction, so some features
                might not work properly. We appreciate your patience and welcome
                any feedback as we continue to improve!
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 sm:px-8 bg-gray-50 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
