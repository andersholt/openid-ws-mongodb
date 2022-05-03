import {Router} from "express"
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const loginApi = new Router()
dotenv.config();

loginApi.use(cookieParser(process.env.COOKIE_SECRET));
loginApi.use(bodyParser.urlencoded());


const oauth_config_google = {
    discovery_url: "https://accounts.google.com/.well-known/openid-configuration",
    client_id: process.env.CLIENT_ID_GOOGLE,
    scope: "email profile",
};

const oauth_config_microsoft = {
    response_type: "code",
    discovery_url:
        "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration",
    client_id: process.env.CLIENT_ID_MICROSOFT,
    scope: "openid profile",
};

const oauth_config = {
    google: oauth_config_google,
    microsoft: oauth_config_microsoft,
};

async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}

loginApi.delete("/", (req, res) => {
    res.clearCookie("access_token");
    res.sendStatus(200);
});

loginApi.get("/google", async (req, res) => {
    const {access_token} = req.signedCookies;

    const discoveryDocument = await fetchJSON(oauth_config.google.discovery_url);
    const {userinfo_endpoint} = discoveryDocument;
    let userinfo = undefined;
    if (access_token) {
        try {
            userinfo = await fetchJSON(userinfo_endpoint, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
        } catch (error) {
            console.error({error});
        }
    }
    if (userinfo !== undefined) {
        userinfo.usertype = "google";
    }

    res.json({userinfo, oauth_config: oauth_config.google}).status(200);
});

loginApi.get("/microsoft", async (req, res) => {
    const {access_token} = req.signedCookies;

    const discoveryDocument = await fetchJSON(
        oauth_config.microsoft.discovery_url
    );

    const {userinfo_endpoint} = discoveryDocument;
    let userinfo = undefined;
    if (access_token) {
        try {
            userinfo = await fetchJSON(userinfo_endpoint, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
        } catch (error) {
            console.error({error});
        }
    }
    if (userinfo !== undefined) {
        userinfo.usertype = "kristiania";
    }
    res.json({userinfo}).status(200);
});


loginApi.get("/config", (req, res) => {
    res.json(oauth_config).json;
});

loginApi.post("/", (req, res) => {
    const {access_token} = req.body;
    res.cookie("access_token", access_token, {signed: true});
    res.sendStatus(200);
});

export default loginApi