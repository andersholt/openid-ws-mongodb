import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./hooks/global";
import {
  LoginCallbackMicrosoft,
  LoginCallbackGoogle,
  LoginMicrosoft,
  LoginProvider,
  ProfileContext,
} from "./components/loginProvider";
import { FrontPage } from "./pages/frontpage";
import { Profile } from "./pages/profile";
import { Movies } from "./pages/movies";
import { ChatApplication } from "./pages/chatapp";

function Application() {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState();
  useEffect(loadLoginInfo, []);

  async function loadLoginInfo() {
    setLoading(true);
    const config = await fetchJSON("/api/login/config");

    const loginMicrosoft = await fetchJSON("/api/login/microsoft");
    const loginGoogle = await fetchJSON("/api/login/google");

    let userinfo;
    if (loginGoogle.userinfo) {
      userinfo = loginGoogle.userinfo;
    } else if (loginMicrosoft.userinfo) {
      userinfo = loginMicrosoft.userinfo;
    }

    setLogin({ config, userinfo });
    setLoading(false);
  }
  if (loading) {
    return <h1>Please wait</h1>;
  }
  return (
    <ProfileContext.Provider value={login}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage reload={loadLoginInfo} />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/chat"} element={<ChatApplication />} />
          <Route path={"/login/google"} element={<LoginProvider />} />
          <Route path={"/login/microsoft"} element={<LoginMicrosoft />} />
          <Route path={"/movies"} element={<Movies />} />
          <Route
            path={"/login/google/callback"}
            element={<LoginCallbackGoogle reload={loadLoginInfo} />}
          />

          <Route
            path={"/login/microsoft/callback"}
            element={<LoginCallbackMicrosoft reload={loadLoginInfo} />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
