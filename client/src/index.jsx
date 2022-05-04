import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {fetchJSON} from "./hooks/global";
import {LoginCallback, LoginProvider, ProfileContext,} from "./hooks/loginProvider";
import {ArticleWrite, FrontPage} from "./pages/frontpage/frontpage";
import LoadingAnimation from "./pages/loadingpage/LoadingPage";
import "./index.css"
import {ProfilePage} from "./pages/profilepage/profilepage";
import {LoginPage} from "./pages/loginpage/loginPage";

function Application() {
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState();
    useEffect(loadLoginInfo, []);

    async function loadLoginInfo() {
        const provider = sessionStorage.getItem('provider');
        setLoading(true);
        let userinfo = undefined
        const config = await fetchJSON("/api/login/config");
        if (provider !== null) {
            const login = await fetchJSON("/api/login/" + provider);
            userinfo = login.userinfo
        }
        setLogin({config, userinfo});
        setLoading(false);
    }

    if (loading) {
        return <LoadingAnimation/>;
    }
    return (
        <ProfileContext.Provider value={login}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<FrontPage reload={loadLoginInfo}/>}/>
                    <Route path={"/login/:provider"} element={<LoginProvider/>}/>
                    <Route path={"/article/new"} element={<ArticleWrite/>}/>
                    <Route path={"/login"} element={<LoginPage/>}/>
                    <Route
                        path={"/login/:provider/callback"}
                        element={<LoginCallback reload={loadLoginInfo}/>}
                    />
                    <Route
                        path={"/profile"}
                        element={<ProfilePage/>}
                    />
                </Routes>
            </BrowserRouter>
        </ProfileContext.Provider>

    );
}

ReactDOM.render(<Application/>, document.getElementById("app"));
