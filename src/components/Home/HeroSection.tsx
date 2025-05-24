import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex  justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <p className="text-8xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Study Group
                </span>
              </p>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Connect with like-minded students, share knowledge, and achieve
                your academic goals together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="px-16 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
              <button className="px-16 py-4 border-2 border-gray-300 text-slate-50 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Abstract Pattern */}
          <div className="relative h-96 lg:h-[500px] overflow-hidden bg-slate-100">
            {/* Main container for the pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Floating geometric shapes */}
              <div className="relative w-full h-full">
                {/* Large circle with gradient */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80 animate-pulse"></div>

                {/* Medium circle */}
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-70 animate-bounce"></div>

                {/* Small circles */}
                <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60"></div>

                {/* Triangular shapes */}
                <div className="absolute top-1/3 right-1/3 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-gradient-to-r border-b-indigo-400 opacity-70 animate-pulse"></div>

                {/* Hexagon */}
                <div className="absolute bottom-1/4 right-1/2 w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-60 transform rotate-45"></div>

                {/* Floating lines/bars */}
                <div className="absolute top-1/2 left-1/2 w-1 h-24 bg-gradient-to-b from-purple-400 to-transparent transform -rotate-12 opacity-50"></div>
                <div className="absolute top-1/3 left-1/2 w-1 h-32 bg-gradient-to-b from-blue-400 to-transparent transform rotate-45 opacity-40"></div>

                {/* Dotted pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="grid grid-cols-8 gap-4 h-full">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i % 3 === 0
                            ? "bg-blue-400"
                            : i % 3 === 1
                            ? "bg-purple-400"
                            : "bg-pink-400"
                        } opacity-60`}
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animation: "pulse 2s infinite",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Background blur elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-2xl opacity-25"></div>
              </div>
            </div>

            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-50/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
