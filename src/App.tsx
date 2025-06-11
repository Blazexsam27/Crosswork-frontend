import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import OAuthHandler from "./components/Auth/OAuthHandler";
import "./App.css";
import ChatBox from "./components/widgets/ChatBox";
import ProtectedRoute from "./ProtectedRoutes";
import { useEffect, useState, lazy, Suspense } from "react";
import { getFromLocalStorage } from "./utils/webstorage.utls";
import Loader from "./components/widgets/Loader";
import ForgotPass from "./components/Auth/ForgotPass";
import ResetPassword from "./components/Auth/ResetPassword";

// Dynamically imported components
const Home = lazy(() => import("./views/Home"));
const UserProfile = lazy(() => import("./views/UserProfile"));
const Forums = lazy(() => import("./views/Forums"));
const Connect = lazy(() => import("./views/Connect"));
const VideoRoom = lazy(() => import("./views/VideoRoom"));
const VideoRoomWaitingLobby = lazy(
  () => import("./views/VideoRoomWaitingLobby")
);
const CreateVideoRoom = lazy(() => import("./views/CreateVideoRoom"));
const About = lazy(() => import("./views/About"));
const DiscussionPage = lazy(() => import("./views/DiscussionPage"));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getFromLocalStorage("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        {isAuthenticated && <ChatBox />}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<LoginForm />}></Route>
            <Route path="/signup" element={<SignupForm />}></Route>
            <Route path="/forgot-password" element={<ForgotPass />}></Route>
            <Route path="/reset-password/*" element={<ResetPassword />}></Route>
            <Route path="/oauth-success" element={<OAuthHandler />}></Route>
            <Route path="/oauth-error" element={<SignupForm />}></Route>
            <Route path="/about" element={<About />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfile />} />

              <Route path="/forums" element={<Forums />} />
              <Route path="/forums/:id" element={<DiscussionPage />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/create-video-room" element={<CreateVideoRoom />} />
              <Route
                path="/waiting-lobby/*"
                element={<VideoRoomWaitingLobby />}
              />
              <Route path="/videoroom/*" element={<VideoRoom />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
