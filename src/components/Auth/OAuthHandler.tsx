import { setInLocalStorage } from "@/utils/webstorage.utls";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/hooks";
import { getUser } from "@/features/user/userSlice";

function OAuthHandler() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // extract the token and save it, then redirect user to the dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setInLocalStorage("authToken", token);

      // get user data and save it to local storage
      dispatch(getUser());
    }
    navigate("/");
  }, []);

  return <div></div>;
}

export default OAuthHandler;
