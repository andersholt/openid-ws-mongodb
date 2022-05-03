import React, {useContext} from "react";
import {ProfileContext} from "../../hooks/loginProvider";
import {LoginPage} from "../loginpage/loginPage";
import {Navbar} from "../../components/navbar/navbar";
import "./frontpage.css"

export function FrontPage() {
    const {userinfo} = useContext(ProfileContext);
    return (
        <div>
            {!userinfo && <LoginPage/>}
            {userinfo && <>
                <Navbar/>
                <div className={"content-container"}>
                    <h1>Exam 2022 Web development and API-design</h1>
                </div>
            </>}
        </div>
    );
}
