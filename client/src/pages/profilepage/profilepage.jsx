import React, {useContext} from "react";
import {LoginPage} from "../loginpage/loginPage";
import {ProfileContext} from "../../hooks/loginProvider";
import {Navbar} from "../../components/navbar/navbar";
import "./profilepage.css"


export function ProfilePage() {
    const {userinfo} = useContext(ProfileContext);

    return (
        <div>
            {!userinfo && <LoginPage/>}
            {userinfo && (
                <div className={"profile-container"}>
                    <Navbar/>
                    <div className={"content-container"}>
                        <h1>
                            Profile for {userinfo.name} ({userinfo.email})
                        </h1>
                        {(userinfo.picture && userinfo.usertype !== "kristiania") && (
                            <img src={userinfo.picture} alt="Profile picture"/>
                        )}
                        {userinfo.usertype === "kristiania" && (
                            <p>Certified by Kristiania University College</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}