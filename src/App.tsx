import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/signup" element={<SignupForm />}></Route>
          <Route path="/oauth-success" element={<OAuthHandler />}></Route>
          <Route path="/oauth-error" element={<SignupForm />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route>
          <Route path="/forum" element={<Forums />}></Route>
          <Route path="/connect" element={<Connect />}></Route>
          <Route path="/videoroom" element={<VideoRoom />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
