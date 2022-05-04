import React, {useContext} from "react";
import "./navbar.css"
import {Link} from "react-router-dom";
import {ProfileContext} from "../../hooks/loginProvider";

export async function handleLogout() {
    await fetch("/api/login", {method: "delete"});
    sessionStorage.removeItem('provider');
    window.location.reload();
}


export function Navbar({editMode, setEditMode}) {
    const {userinfo} = useContext(ProfileContext)

    function switchEditMode() {
        if (editMode === true) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }
    }

    let editButtonText = "Enter editmode"
    if (editMode === true) {
        editButtonText = "Leave editmode"
    }

    return (
        <div className={"navbar"}>
            <div className={"pages"}>
                <h2>Kristiania News</h2>
                <Link to={"/"}><p>Home</p></Link>
                {(userinfo && userinfo.usertype) === "kristiania" &&
                    <>
                        <Link to={"/article/new"}><p>Write new article</p></Link>
                        <button onClick={switchEditMode}>{editButtonText}</button>
                    </>
                }
            </div>

            <div className={"profile-stuff"}>
                {userinfo &&
                    <>
                        <Link to={"/profile"}><p>Profile</p></Link>
                        <button onClick={handleLogout}>Log out</button>
                        {(userinfo.picture && userinfo.usertype !== "kristiania") &&
                            <img src={userinfo.picture}/>
                        }
                    </>
                }
                {!userinfo &&
                    <Link to={"/login"}>Login</Link>
                }
            </div>
        </div>
    );
}
