"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  subject: string;
  votes: number;
  userVote: "up" | "down" | null;
  commentsCount: number;
  createdAt: string;
  isHot: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  votes: number;
  userVote: "up" | "down" | null;
  createdAt: string;
  replies: Comment[];
}

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Best strategies for learning React Hooks effectively?",
    content:
      "I've been struggling with understanding useEffect and useCallback. What are some practical exercises or projects that helped you master these concepts?",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 1250,
    },
    subject: "Computer Science",
    votes: 24,
    userVote: null,
    commentsCount: 12,
    createdAt: "2024-01-20T10:30:00Z",
    isHot: true,
  },
  {
    id: "2",
    title: "Calculus study group forming - Advanced topics",
    content:
      "Looking to form a study group for Calculus III. We'll be covering multivariable calculus, partial derivatives, and vector calculus. Meeting twice a week.",
    author: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 890,
    },
    subject: "Mathematics",
    votes: 18,
    userVote: "up",
    commentsCount: 8,
    createdAt: "2024-01-19T15:45:00Z",
    isHot: false,
  },
  {
    id: "3",
    title: "Physics lab report help - Quantum mechanics experiment",
    content:
      "Need help interpreting results from our quantum tunneling experiment. The data doesn't match theoretical predictions and I'm not sure where I went wrong.",
    author: {
      name: "Alex Rivera",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 567,
    },
    subject: "Physics",
    votes: 15,
    userVote: null,
    commentsCount: 6,
    createdAt: "2024-01-19T09:20:00Z",
    isHot: false,
  },
  {
    id: "4",
    title: "Machine Learning resources for beginners",
    content:
      "Compiled a list of the best free resources for getting started with ML. Includes courses, books, and hands-on projects. What would you add to this list?",
    author: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 2100,
    },
    subject: "Computer Science",
    votes: 42,
    userVote: "up",
    commentsCount: 23,
    createdAt: "2024-01-18T14:10:00Z",
    isHot: true,
  },
];

const subjects = [
  { name: "Computer Science", count: 156, color: "bg-blue-100 text-blue-800" },
  { name: "Mathematics", count: 89, color: "bg-purple-100 text-purple-800" },
  { name: "Physics", count: 67, color: "bg-green-100 text-green-800" },
  { name: "Chemistry", count: 45, color: "bg-yellow-100 text-yellow-800" },
  { name: "Biology", count: 34, color: "bg-pink-100 text-pink-800" },
  { name: "Engineering", count: 78, color: "bg-indigo-100 text-indigo-800" },
];

export default function ForumPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleVote = (discussionId: string, voteType: "up" | "down") => {
    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          let newVotes = discussion.votes;
          let newUserVote: "up" | "down" | null = voteType;

          // Handle vote logic
          if (discussion.userVote === voteType) {
            // Remove vote if clicking same vote
            newUserVote = null;
            newVotes += voteType === "up" ? -1 : 1;
          } else if (discussion.userVote === null) {
            // Add new vote
            newVotes += voteType === "up" ? 1 : -1;
          } else {
            // Change vote
            newVotes += voteType === "up" ? 2 : -2;
          }

          return {
            ...discussion,
            votes: newVotes,
            userVote: newUserVote,
          };
        }
        return discussion;
      })
    );
  };

  const filteredDiscussions = discussions
    .filter((discussion) => {
      const matchesSearch =
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        !selectedSubject || discussion.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hot":
          return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0) || b.votes - a.votes;
        case "new":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "top":
          return b.votes - a.votes;
        default:
          return 0;
      }
    });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Forum</h1>
              <p className="text-gray-600 mt-1">
                Connect, discuss, and learn together
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Start Discussion</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "hot" | "new" | "top")
                }
                className="px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="hot">🔥 Hot</option>
                <option value="new">🕒 New</option>
                <option value="top">⭐ Top</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subjects
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSubject === null
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Subjects
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject.name}
                    onClick={() => setSelectedSubject(subject.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedSubject === subject.name
                        ? subject.color
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{subject.name}</span>
                    <span className="text-sm text-gray-500">
                      {subject.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Forum Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Discussions</span>
                    <span className="font-semibold">469</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-semibold">89 new</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                        <button
                          onClick={() => handleVote(discussion.id, "up")}
                          className={`p-2 rounded-lg transition-colors ${
                            discussion.userVote === "up"
                              ? "bg-green-100 text-green-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <span
                          className={`font-semibold ${
                            discussion.votes > 0
                              ? "text-green-600"
                              : discussion.votes < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {discussion.votes}
                        </span>
                        <button
                          onClick={() => handleVote(discussion.id, "down")}
                          className={`p-2 rounded-lg transition-colors ${
                            discussion.userVote === "down"
                              ? "bg-red-100 text-red-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {discussion.isHot && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              🔥 Hot
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              subjects.find(
                                (s) => s.name === discussion.subject
                              )?.color || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {discussion.subject}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                          {discussion.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {discussion.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={
                                  discussion.author.avatar || "/placeholder.svg"
                                }
                                alt={discussion.author.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600">
                                {discussion.author.name}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {discussion.author.reputation} rep
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(discussion.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">
                                {discussion.commentsCount}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDiscussions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters, or start a new
                  discussion!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <CreateDiscussionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(newDiscussion) => {
            setDiscussions((prev) => [newDiscussion, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

interface CreateDiscussionModalProps {
  onClose: () => void;
  onSubmit: (discussion: Discussion) => void;
}

function CreateDiscussionModal({
  onClose,
  onSubmit,
}: CreateDiscussionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !subject) return;

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 100,
      },
      subject,
      votes: 1,
      userVote: "up",
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isHot: false,
    };

    onSubmit(newDiscussion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Provide more details about your discussion..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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
