import HeroSection from "@/components/Home/HeroSection";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Video,
  MessageCircle,
  ChevronRight,
  Star,
  Smile,
  UsersRound,
} from "lucide-react";
function Home() {
  return (
    <div className="">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                10,000+
              </p>
              <p className="text-gray-600 mt-2">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                5,000+
              </p>
              <p className="text-gray-600 mt-2">Study Sessions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                200+
              </p>
              <p className="text-gray-600 mt-2">Universities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                50+
              </p>
              <p className="text-gray-600 mt-2">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Study Better
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CrossWork provides all the tools you need to connect with other
              students and excel in your studies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Video className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Video Study Rooms
              </h3>
              <p className="text-gray-600 mb-6">
                Create or join virtual study rooms with video, audio, and screen
                sharing capabilities. Perfect for group projects and
                collaborative learning.
              </p>
              <NavLink
                to="/video-chat/create"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                Create a room <ChevronRight className="w-4 h-4 ml-1" />
              </NavLink>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Discussion Forum
              </h3>
              <p className="text-gray-600 mb-6">
                Ask questions, share insights, and engage in meaningful academic
                discussions with students from around the world.
              </p>
              <NavLink
                to="/forum"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                Browse discussions <ChevronRight className="w-4 h-4 ml-1" />
              </NavLink>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Student Connections
              </h3>
              <p className="text-gray-600 mb-6">
                Find and connect with students who share your academic
                interests, subjects, and learning goals.
              </p>
              <NavLink
                to="/connections"
                className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                Find connections <ChevronRight className="w-4 h-4 ml-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How CrossWork Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is easy - connect, collaborate, and excel in your
              studies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Create Your Profile
              </h3>
              <p className="text-gray-600 text-center">
                Sign up and create your profile with your academic interests,
                subjects, and study preferences.
              </p>

              {/* Connector line (visible on md and up) */}
              {/* <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-8"></div> */}
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Connect With Others
              </h3>
              <p className="text-gray-600 text-center">
                Find and connect with students who share your interests or join
                existing study groups.
              </p>

              {/* Connector line (visible on md and up) */}
              {/* <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-8"></div> */}
            </div>

            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Study Together
              </h3>
              <p className="text-gray-600 text-center">
                Create or join video study rooms, participate in discussions,
                and share resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who have transformed their learning experience
              with CrossWork
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8 relative">
              <div className="absolute -top-4 -left-4 text-purple-500">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5V12.5C5 11.837 5.26339 11.2011 5.73223 10.7322C6.20107 10.2634 6.83696 10 7.5 10H12.5C13.163 10 13.7989 10.2634 14.2678 10.7322C14.7366 11.2011 15 11.837 15 12.5V27.5M35 20H30C29.337 20 28.7011 19.7366 28.2322 19.2678C27.7634 18.7989 27.5 18.163 27.5 17.5V12.5C27.5 11.837 27.7634 11.2011 28.2322 10.7322C28.7011 10.2634 29.337 10 30 10H35C35.663 10 36.2989 10.2634 36.7678 10.7322C37.2366 11.2011 37.5 11.837 37.5 12.5V27.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center mb-6 pt-4">
                <div className="mr-4">
                  <Smile className="w-16 h-16 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Sarah Chen
                  </h4>
                  <p className="text-gray-600">Computer Science Major</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "CrossWork helped me find study partners for my advanced
                algorithms class. The video rooms made collaboration so much
                easier, and I've made lasting connections with peers from around
                the world."
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 relative">
              <div className="absolute -top-4 -left-4 text-purple-500">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5V12.5C5 11.837 5.26339 11.2011 5.73223 10.7322C6.20107 10.2634 6.83696 10 7.5 10H12.5C13.163 10 13.7989 10.2634 14.2678 10.7322C14.7366 11.2011 15 11.837 15 12.5V27.5M35 20H30C29.337 20 28.7011 19.7366 28.2322 19.2678C27.7634 18.7989 27.5 18.163 27.5 17.5V12.5C27.5 11.837 27.7634 11.2011 28.2322 10.7322C28.7011 10.2634 29.337 10 30 10H35C35.663 10 36.2989 10.2634 36.7678 10.7322C37.2366 11.2011 37.5 11.837 37.5 12.5V27.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center mb-6 pt-4">
                <div className="mr-4">
                  <Smile className="w-16 h-16 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Marcus Johnson
                  </h4>
                  <p className="text-gray-600">Physics Major</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "The discussion forums on CrossWork have been invaluable for my
                quantum mechanics course. Being able to ask questions and get
                different perspectives has deepened my understanding
                tremendously."
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 relative">
              <div className="absolute -top-4 -left-4 text-purple-500">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5V12.5C5 11.837 5.26339 11.2011 5.73223 10.7322C6.20107 10.2634 6.83696 10 7.5 10H12.5C13.163 10 13.7989 10.2634 14.2678 10.7322C14.7366 11.2011 15 11.837 15 12.5V27.5M35 20H30C29.337 20 28.7011 19.7366 28.2322 19.2678C27.7634 18.7989 27.5 18.163 27.5 17.5V12.5C27.5 11.837 27.7634 11.2011 28.2322 10.7322C28.7011 10.2634 29.337 10 30 10H35C35.663 10 36.2989 10.2634 36.7678 10.7322C37.2366 11.2011 37.5 11.837 37.5 12.5V27.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center mb-6 pt-4">
                <div className="mr-4">
                  <Smile className="w-16 h-16 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Emily Rodriguez
                  </h4>
                  <p className="text-gray-600">Mathematics Major</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">
                "As a remote student, I was struggling to find study groups.
                CrossWork changed everything - now I have a regular study group
                for calculus, and my grades have improved significantly!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Discussions
            </h2>
            <NavLink
              to="/forum"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all discussions <ArrowRight className="ml-2 w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Computer Science
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🔥 Hot
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  Best strategies for learning React Hooks effectively?
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  I've been struggling with understanding useEffect and
                  useCallback. What are some practical exercises or projects
                  that helped you master these concepts?
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/placeholder.svg?height=24&width=24"
                      alt="Sarah Chen"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">Sarah Chen</span>
                  </div>
                  <span className="text-sm text-gray-500">2h ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Mathematics
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  Calculus study group forming - Advanced topics
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Looking to form a study group for Calculus III. We'll be
                  covering multivariable calculus, partial derivatives, and
                  vector calculus. Meeting twice a week.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/placeholder.svg?height=24&width=24"
                      alt="Mike Johnson"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">Mike Johnson</span>
                  </div>
                  <span className="text-sm text-gray-500">5h ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Physics
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  Physics lab report help - Quantum mechanics experiment
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Need help interpreting results from our quantum tunneling
                  experiment. The data doesn't match theoretical predictions and
                  I'm not sure where I went wrong.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/placeholder.svg?height=24&width=24"
                      alt="Alex Rivera"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">Alex Rivera</span>
                  </div>
                  <span className="text-sm text-gray-500">8h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Study Rooms */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Study Rooms
            </h2>
            <NavLink
              to="/video-chat/create"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              Create a room <ArrowRight className="ml-2 w-4 h-4" />
            </NavLink>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white opacity-75" />
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  Live Now
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Advanced Calculus Study Group
                </h3>
                <p className="text-gray-600 mb-4">
                  Working through multivariable calculus problems and preparing
                  for midterms.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <UsersRound className="w-9 h-9 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +2
                    </div>
                  </div>
                  <NavLink
                    to="/video-chat/room-abc-123"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white opacity-75" />
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  Starting in 15m
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Web Development Workshop
                </h3>
                <p className="text-gray-600 mb-4">
                  Building a full-stack application with React and Node.js.
                  Beginners welcome!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <UsersRound className="w-9 h-9 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +1
                    </div>
                  </div>
                  <NavLink
                    to="/video-chat/room-def-456"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white opacity-75" />
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  Today, 7:00 PM
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Organic Chemistry Study Session
                </h3>
                <p className="text-gray-600 mb-4">
                  Reviewing reaction mechanisms and preparing for the upcoming
                  lab assignment.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <UsersRound className="w-9 h-9 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +0
                    </div>
                  </div>
                  <NavLink
                    to="/video-chat/room-ghi-789"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who are already connecting,
            collaborating, and excelling with CrossWork.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink
              to="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Sign Up Free
            </NavLink>
            <NavLink
              to="/forums"
              className="px-8 py-4 bg-blue-800 bg-opacity-50 text-white font-semibold rounded-xl hover:bg-opacity-70 transition-colors"
            >
              Checkout Forums
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
