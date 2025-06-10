import { setInLocalStorage } from "@/utils/webstorage.utls";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { getUser } from "@/features/user/userSlice";

function OAuthHandler() {
  const dispatch = useAppDispatch();

  const initUserInStorage = async () => {
    // get user data and save it to local storage
    await dispatch(getUser());
    window.location.href = "/";
  };

  useEffect(() => {
    // extract the token and save it, then redirect user to the dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setInLocalStorage("authToken", token);
      initUserInStorage();
    }
  }, []);

  return <div></div>;
}

export default OAuthHandler;
