import React, {useContext} from "react";
import "./navbar.css"
import {Link} from "react-router-dom";
import {ProfileContext} from "../../hooks/loginProvider";

export async function handleLogout() {
    await fetch("/api/login", {method: "delete"});
    sessionStorage.removeItem('provider');
    window.location.reload();
}

export function Navbar() {
    const {userinfo} = useContext(ProfileContext)
    return (
        <div className={"navbar"}>
            <div className={"pages"}>
                <Link to={"/"}><p>Home</p></Link>
                <Link to={"/"}><p>Page 2</p></Link>
                <Link to={"/"}><p>Page 3</p></Link>
            </div>

            <div className={"profile-stuff"}>
                <Link to={"/profile"}><p>Profile</p></Link>
                <button onClick={handleLogout}>Log out</button>
                {(userinfo.picture && userinfo.usertype !== "kristiania") &&
                    <img src={userinfo.picture}/>
                }
            </div>
        </div>
    );
}
