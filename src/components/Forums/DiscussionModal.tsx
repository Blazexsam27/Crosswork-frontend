import type {
  CreateDiscussionModalProps,
  Discussion,
} from "@/types/forums/forumTypes";
import React, { useState } from "react";
import { subjects } from "./static";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

function DiscussionModal({ onClose, onSubmit }: CreateDiscussionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const user = getFromLocalStorage("user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !subject) return;

    // prepare data
    const threadData = {
      title,
      content,
      category: subject,
      author: user._id,
    };
    onSubmit(threadData);
  };

  return (
    <div className="fixed inset-0 bg-violet-500/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Start New Discussion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subj) => (
                  <option key={subj.name} value={subj.name}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's your question or topic?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
                placeholder="Provide more details about your discussion..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DiscussionModal;
