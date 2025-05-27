"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Users,
  MessageCircle,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import userService from "@/services/user.service";
import { interests } from "@/static/Connect";
import { subjects } from "@/static/Connect";
import connectService from "@/services/connect.service";
import { ToastContainer, toast } from "react-toastify";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

interface Student {
  _id: string;
  name: string;
  profilePic: string;
  interests: string[];
  subjects: string[];
  languages: string[];
  bio: string;
}

interface StudentCardProps {
  student: Student;
  onConnect: (id: string) => void;
  onCancelRequest: (id: string) => void;
  onViewProfile: (student: Student) => void;
  isCompact?: boolean;
  connectionStates: Record<string, "none" | "pending" | "connected">;
}

function StudentCard({
  student,
  onConnect,
  onCancelRequest,
  onViewProfile,
  isCompact = false,
  connectionStates,
}: StudentCardProps) {
  const connectionStatus = connectionStates[student._id] || "none";

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "none":
        return (
          <button
            onClick={() => onConnect(student._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <UserPlus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        );
      case "pending":
        return (
          <button
            onClick={() => onCancelRequest(student._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Pending</span>
          </button>
        );
      case "connected":
        return (
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <Check className="w-4 h-4" />
            <span>Connected</span>
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={student.profilePic || "/placeholder.svg?height=80&width=80"}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {student.name}
          </h3>
          <p className="text-sm text-gray-600">
            {student.subjects.slice(0, 2).join(" • ")}
          </p>
        </div>
      </div>

      {!isCompact && (
        <p className="text-gray-600 mt-4 text-sm line-clamp-2">{student.bio}</p>
      )}

      <div className="mt-4">
        <div className="flex flex-wrap gap-1">
          {student.interests.slice(0, isCompact ? 2 : 3).map((interest) => (
            <span
              key={interest}
              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {interest}
            </span>
          ))}
          {student.interests.length > (isCompact ? 2 : 3) && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{student.interests.length - (isCompact ? 2 : 3)} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        {getConnectionButton()}
        <button
          onClick={() => onViewProfile(student)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>View Profile</span>
        </button>
        {connectionStatus === "connected" && (
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
  onConnect: (id: string) => void;
  onCancelRequest: (id: string) => void;
  connectionStates: Record<string, "none" | "pending" | "connected">;
}

function StudentProfileModal({
  student,
  onClose,
  onConnect,
  onCancelRequest,
  connectionStates,
}: StudentProfileModalProps) {
  const connectionStatus = connectionStates[student._id] || "none";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={
                    student.profilePic || "/placeholder.svg?height=80&width=80"
                  }
                  alt={student.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student.name}
                </h2>
                <p className="text-gray-600">
                  {student.subjects.slice(0, 2).join(" • ")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h3>
              <p className="text-gray-700">{student.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.languages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              {connectionStatus === "none" && (
                <button
                  onClick={() => {
                    onConnect(student._id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Connect</span>
                </button>
              )}
              {connectionStatus === "pending" && (
                <button
                  onClick={() => {
                    onCancelRequest(student._id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel Request</span>
                </button>
              )}
              {connectionStatus === "connected" && (
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-xl">
                  <Check className="w-5 h-5" />
                  <span>Connected</span>
                </button>
              )}
              <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [connectionStates, setConnectionStates] = useState<
    Record<string, "none" | "pending" | "connected">
  >({});

  const handleConnect = async (studentId: string) => {
    try {
      const user = getFromLocalStorage("user");

      await connectService.sendConnectRequest(studentId, user._id);
      setConnectionStates((prev) => ({
        ...prev,
        [studentId]: "pending",
      }));

      toast("Connection request sent!");
    } catch (error) {
      console.error("Error while connecting:", error);
    }
  };

  const handleCancelRequest = (studentId: string) => {
    setConnectionStates((prev) => ({
      ...prev,
      [studentId]: "none",
    }));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((i) => i !== subject)
        : [...prev, subject]
    );
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      student.interests.some((interest) =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesInterests =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) =>
        student.interests.includes(interest)
      );

    return matchesSearch && matchesInterests;
  });

  const suggestedStudents = students
    .filter((student) => (connectionStates[student._id] || "none") === "none")
    .slice(0, 3);

  const getAllUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setStudents(response);
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer />
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Study Partners
              </h1>
              <p className="text-gray-600 mt-1">
                Connect with students who share your interests and subjects
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredStudents.length} students found
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, subjects, or interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-700 text-slate-50 flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {interests.map((interest) => (
                        <label key={interest} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedInterests.includes(interest)}
                            onChange={() => toggleInterest(interest)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {interest}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Filters
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setSelectedInterests([
                            "Machine Learning",
                            "AI Research",
                          ])
                        }
                        className="block w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        AI & Machine Learning
                      </button>
                      <button
                        onClick={() =>
                          setSelectedInterests(["Web Development"])
                        }
                        className="block w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Web Development
                      </button>
                      <button
                        onClick={() => setSelectedInterests(["Research"])}
                        className="block w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        Research
                      </button>
                      <button
                        onClick={() => setSelectedInterests([])}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects
                    </label>
                    <div className="flex flex-wrap gap-2 my-2">
                      {selectedSubjects.length > 0 &&
                        selectedSubjects.map((subject) => {
                          return (
                            <div className="w-max px-2 py-1 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1">
                              <span>{subject}</span>

                              <X
                                className="cursor-pointer w-4 h-4 mt-[2.5px]"
                                onClick={() => toggleSubject(subject)}
                              />
                            </div>
                          );
                        })}
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {subjects.map((subject) => (
                        <label key={subject} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => toggleSubject(subject)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {subject}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Connections */}
        {suggestedStudents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Suggested for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onConnect={handleConnect}
                  onCancelRequest={handleCancelRequest}
                  onViewProfile={setSelectedStudent}
                  isCompact={true}
                  connectionStates={connectionStates}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Students */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            All Students
          </h2>
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onConnect={handleConnect}
                  onCancelRequest={handleCancelRequest}
                  onViewProfile={setSelectedStudent}
                  connectionStates={connectionStates}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onConnect={handleConnect}
          onCancelRequest={handleCancelRequest}
          connectionStates={connectionStates}
        />
      )}
    </div>
  );
}
