import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Video,
  MessageCircle,
  BookOpen,
  Smile,
} from "lucide-react";
import Footer from "@/components/Footer/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Connecting Students for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Better Learning
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              CrossWork is a collaborative platform designed to help students
              connect, study together, and achieve their academic goals through
              meaningful interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At CrossWork, we believe that learning is inherently social. Our
                mission is to break down the barriers of isolated studying and
                create a vibrant community where knowledge is shared, questions
                are welcomed, and collaboration thrives.
              </p>
              <p className="text-lg text-gray-600">
                We're dedicated to providing students with the tools they need
                to connect with like-minded peers, exchange ideas, and support
                each other's academic journeys, regardless of physical location
                or institution.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-sm p-8">
              <div className="aspect-video relative bg-white rounded-sm overflow-hidden shadow-lg">
                <img
                  src="/assets/about_1.jpg"
                  alt="Students collaborating"
                  className="w-[600px] h-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to connect, collaborate, and excel in your
              studies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-sm shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Video Study Rooms
              </h3>
              <p className="text-gray-600">
                Create or join virtual study rooms with video, audio, and screen
                sharing capabilities.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discussion Forum
              </h3>
              <p className="text-gray-600">
                Ask questions, share insights, and engage in meaningful academic
                discussions.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Student Connections
              </h3>
              <p className="text-gray-600">
                Find and connect with students who share your academic interests
                and goals.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Resource Sharing
              </h3>
              <p className="text-gray-600">
                Share study materials, notes, and helpful resources with your
                study groups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and create your profile with your academic interests,
                subjects, and study preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect With Others
              </h3>
              <p className="text-gray-600">
                Find and connect with students who share your interests or join
                existing study groups.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Study Together
              </h3>
              <p className="text-gray-600">
                Create or join video study rooms, participate in discussions,
                and share resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
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
            <div className="bg-white rounded-sm shadow-md p-6">
              <div className="flex items-center mb-4">
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
              <p className="text-gray-600 italic">
                "CrossWork helped me find study partners for my advanced
                algorithms class. The video rooms made collaboration so much
                easier, and I've made lasting connections with peers from around
                the world."
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6">
              <div className="flex items-center mb-4">
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
              <p className="text-gray-600 italic">
                "The discussion forums on CrossWork have been invaluable for my
                quantum mechanics course. Being able to ask questions and get
                different perspectives has deepened my understanding
                tremendously."
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6">
              <div className="flex items-center mb-4">
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
              <p className="text-gray-600 italic">
                "As a remote student, I was struggling to find study groups.
                CrossWork changed everything - now I have a regular study group
                for calculus, and my grades have improved significantly!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Have questions about CrossWork? Find answers to common questions
              below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is CrossWork free to use?
              </h3>
              <p className="text-gray-600">
                CrossWork offers a free basic plan with limited features.
                Premium plans are available for enhanced capabilities such as
                longer video sessions, recording, and advanced collaboration
                tools.
              </p>
            </div>

            <div className="bg-gray-50 rounded-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do I need to download any software?
              </h3>
              <p className="text-gray-600">
                No, CrossWork is entirely web-based. You only need a modern
                browser and a stable internet connection to use all features.
              </p>
            </div>

            <div className="bg-gray-50 rounded-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How many people can join a video study room?
              </h3>
              <p className="text-gray-600">
                Free accounts can host up to 5 participants in a room. Premium
                accounts can host up to 50 or 100 participants depending on the
                plan.
              </p>
            </div>

            <div className="bg-gray-50 rounded-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is my data secure on CrossWork?
              </h3>
              <p className="text-gray-600">
                Yes, we take data security seriously. All video sessions are
                encrypted, and we never share your personal information with
                third parties. Please see our Privacy Policy for more details.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Still have questions? We're here to help!
            </p>
            <NavLink
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Contact Us <ArrowRight className="ml-2 w-4 h-4" />
            </NavLink>
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
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              Sign Up Free
            </NavLink>
            <NavLink
              to="/create-video-room"
              className="px-8 py-4 bg-blue-800 bg-opacity-50 text-white font-semibold rounded-sm hover:bg-opacity-70 transition-colors"
            >
              Create a Study Room
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
