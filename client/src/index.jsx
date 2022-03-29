import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ListMovies } from "./components/moviesList";
import { fetchJSON } from "./hooks/global";
import { LoginHook, LoginCallback, ProfileContext } from "./hooks/loginHook";
import { FrontPage } from "./pages/frontpage";
import { Profile } from "./pages/profile";
import { Movies } from "./pages/movies";

function Application() {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState();
  useEffect(loadLoginInfo, []);

  async function loadLoginInfo() {
    setLoading(true);
    setLogin(await fetchJSON("/api/login"));
    setLoading(false);
  }

  useEffect(() => {
    console.log({ login });
  }, [login]);

  if (loading) {
    return <h1>Please wait</h1>;
  }

  return (
    <ProfileContext.Provider value={login}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage reload={loadLoginInfo} />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/login"} element={<LoginHook />} />
          <Route path={"/movies"} element={<Movies />} />
          <Route
            path={"/login/callback"}
            element={<LoginCallback reload={loadLoginInfo} />}
          />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
