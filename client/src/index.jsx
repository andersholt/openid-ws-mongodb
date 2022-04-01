import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchJSON } from "./hooks/global";
import {
  LoginCallback,
  LoginProvider,
  LoginMicrosoft,
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
    setLogin(await fetchJSON("/api/login"));
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
            path={"/login/:identityProvider/callback"}
            element={<LoginCallback reload={loadLoginInfo} />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
