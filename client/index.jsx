import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const ProfileContext = React.createContext({
  userinfo: undefined,
});

function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);
  console.log(userinfo);

  async function handleLogout() {
    await fetch("/api/login", { method: "delete" });
    reload();
  }
  return (
    <div>
      {!userinfo && (
        <div>
          <Link to={"/login"}>Log in</Link>
        </div>
      )}
      {userinfo && (
        <div>
          <Link to={"/profile"}>Profile for {userinfo.name}</Link>
        </div>
      )}
      {userinfo && (
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

function Login() {
  const { oauth_config } = useContext(ProfileContext);
  useEffect(async () => {
    const { discovery_url, client_id, scope } = oauth_config;
    const discoveryDocument = await fetchJSON(discovery_url);
    const { authorization_endpoint } = discoveryDocument;
    const params = {
      response_type: "token",
      response_mode: "fragment",
      scope,
      client_id,
      redirect_uri: window.location.origin + "/login/callback",
    };
    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(params);
  }, []);
  return <h1>Please wait</h1>;
}

function LoginCallback({ reload }) {
  const navigate = useNavigate();
  useEffect(async () => {
    const { access_token } = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1))
    );
    const res = await fetch("/api/login", {
      method: "POST",
      body: new URLSearchParams({ access_token }),
    });
    if (res.ok) {
      reload();
      navigate("/");
    }
  });
  return <h1>Loading ...</h1>;
}

function useLoader(loadingFn) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  async function load() {
    try {
      setLoading(true);
      setData(await loadingFn());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => load(), []);
  return { loading, data, error };
}

function Profile() {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      <h1>
        Profile for {userinfo.name} ({userinfo.email})
      </h1>
      <div>
        <img src={userinfo.picture} alt="Profile picture" />
      </div>
    </div>
  );
}

function ListMovies() {
  const { loading, data, error } = useLoader(async () => {
    return await fetchJSON("/api/movies");
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <div>
      <h1>Movies in the database:</h1>

      {data.map((movie, index) => (
        <div key={index}>
          <li>{movie.title}</li>
          <img src={movie.poster} style={{ width: "200px" }} />
        </div>
      ))}
    </div>
  );
}

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
    return <div>Loading...</div>;
  }

  return (
    <ProfileContext.Provider value={login}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage reload={loadLoginInfo} />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/movies"} element={<ListMovies />} />
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
