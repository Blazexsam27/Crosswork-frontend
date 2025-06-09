import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/Home";
import Navbar from "./components/Navbar/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import OAuthHandler from "./components/Auth/OAuthHandler";
import UserProfile from "./views/UserProfile";
import Forums from "./views/Forums";
import Connect from "./views/Connect";
import "./App.css";
import VideoRoom from "./views/VideoRoom";
import VideoRoomWaitingLobby from "./views/VideoRoomWaitingLobby";
import CreateVideoRoom from "./views/CreateVideoRoom";
import About from "./views/About";
import DiscussionPage from "./views/DiscussionPage";
import ChatBox from "./components/widgets/ChatBox";
import ProtectedRoute from "./ProtectedRoutes";

import { useEffect, useState } from "react";
import { getFromLocalStorage } from "./utils/webstorage.utls";

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
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/signup" element={<SignupForm />}></Route>
          <Route path="/oauth-success" element={<OAuthHandler />}></Route>
          <Route path="/oauth-error" element={<SignupForm />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
