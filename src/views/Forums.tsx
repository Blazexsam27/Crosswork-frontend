"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import type {
  ThreadCreateType,
  ThreadRetrieveType,
  VoteType,
} from "@/types/forums/forumTypes";
import { subjects } from "@/components/Forums/static";
import DiscussionModal from "@/components/Forums/DiscussionModal";
import threadService from "@/services/thread.service";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

export default function ForumPage() {
  const [threads, setThreads] = useState<ThreadRetrieveType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const user = getFromLocalStorage("user");

  const handleVote = async (threadId: string, voteType: "up" | "down") => {
    try {
      const thread = threads.find((t) => t._id === threadId);
      if (!thread) return;

      const userId = user._id;
      const existingVoteIndex = thread.votes.findIndex(
        (v) => v.userId === userId
      );

      // Case 1: Clicking same vote type again - remove vote
      if (
        existingVoteIndex >= 0 &&
        thread.votes[existingVoteIndex].voteType === voteType
      ) {
        thread.votes = thread.votes.filter((v) => v.userId !== userId);
      }
      // Case 2: Changing vote type or new vote
      else {
        const newVote = { userId, voteType };

        if (existingVoteIndex >= 0) {
          // Update existing vote
          thread.votes[existingVoteIndex] = newVote;
        } else {
          // Add new vote
          thread.votes.push(newVote);
        }
      }

      await threadService.updateThread(threadId, { votes: thread.votes });

      await getAllThreads();
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const checkVote = (threadId: string, voteType: "up" | "down") => {
    try {
      const thread = threads.find((t) => t._id === threadId);
      if (!thread) return;

      const userId = user._id;
      const vote = thread.votes.find((v) => v.userId === userId);

      return vote?.voteType === voteType ? true : false;
    } catch (error) {
      console.error("Error while checking vote:", error);
      return null;
    }
  };

  const filteredThreads = threads
    .filter((thread) => {
      const matchesSearch =
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        !selectedSubject || thread.category === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "new":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "top":
          return b.votes.length - a.votes.length;
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

  async function handleThreadSubmit(
    newDiscussion: ThreadCreateType
  ): Promise<void> {
    try {
      await threadService.createThread(newDiscussion);
    } catch (error) {
      console.error("Error while creating thread", error);
    }
  }

  async function getAllThreads() {
    try {
      const response = await threadService.getAllThreads();
      setThreads(response);
    } catch (error) {
      console.error("Error while getting threads", error);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, []);

  function calcTotalVotes(votes: VoteType[]): number {
    return votes.reduce((total, vote) => {
      if (vote.voteType === "up") {
        return total + 1;
      } else if (vote.voteType === "down") {
        return total - 1;
      }
      return total;
    }, 0);
  }

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
                <option value="hot">🔥 Trending</option>
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
              {filteredThreads.map((thread: ThreadRetrieveType) => (
                <div
                  key={thread._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                        <button
                          onClick={() => handleVote(thread._id, "up")}
                          className={`p-2 rounded-lg transition-colors cursor-pointer  ${
                            checkVote(thread._id, "up")
                              ? "bg-green-100 text-green-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <span
                          className={`font-semibold ${
                            thread.votes.length > 0
                              ? "text-green-600"
                              : thread.votes.length < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {calcTotalVotes(thread.votes)}
                        </span>
                        <button
                          onClick={() => handleVote(thread._id, "down")}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            checkVote(thread._id, "down")
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
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              subjects.find((s) => s.name === thread.category)
                                ?.color || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {thread.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                          {thread.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {thread.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {/* <img
                                src={
                                  thread.author.avatar || "/placeholder.svg"
                                }
                                alt={thread.author.name}
                                className="w-6 h-6 rounded-full"
                              /> */}
                              <span className="text-sm text-gray-600">
                                {thread.author.name}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {/* {thread.author.reputation} rep */}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(thread.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">
                                {/* {thread.commentsCount} */}
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

            {filteredThreads.length === 0 && (
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
        <DiscussionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(newDiscussion) => handleThreadSubmit(newDiscussion)}
        />
      )}
    </div>
  );
}
