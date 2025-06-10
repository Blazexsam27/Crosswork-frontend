import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/features/auth/authSlice";
import { Menu, X, User, HomeIcon, LogOut } from "lucide-react";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const user = getFromLocalStorage("user");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeDropdown();
    navigate("/login");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CrossWork
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </NavLink>
              <NavLink
                to="/connect"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Connect
              </NavLink>
              <NavLink
                to="/create-video-room"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Room
              </NavLink>
              <NavLink
                to="/forums"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Forum
              </NavLink>
              <NavLink
                to="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About
              </NavLink>

              {/* Authentication Section */}
              {!isAuthenticated ? (
                <NavLink
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Login
                </NavLink>
              ) : (
                <div className="relative ">
                  <button
                    onClick={toggleDropdown}
                    className="cursor-pointer flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      P
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-200 py-2 z-50">
                      <NavLink
                        to="/profile"
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </NavLink>
                      <NavLink
                        to="/rooms"
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HomeIcon className="w-4 h-4 mr-3" />
                        Rooms
                      </NavLink>
                      <NavLink
                        to="/Invites"
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HomeIcon className="w-4 h-4 mr-3" />
                        Invites ({user?.pendingRequests?.length})
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <NavLink
                to="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/forums"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Forum
              </NavLink>
              <NavLink
                to="/about"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>

              {/* Mobile Authentication Section */}
              {!isAuthenticated ? (
                <NavLink
                  to="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white block px-3 py-2 text-base font-medium rounded-lg mx-3 mt-4 text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <NavLink
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/invites"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Invites ({user.pendingRequests.length})
                  </NavLink>
                  <NavLink
                    to="/rooms"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Rooms
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
      )}
    </nav>
  );
}

export default Navbar;
