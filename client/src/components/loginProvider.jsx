import React, { useContext, useEffect } from "react";
import { fetchJSON } from "../hooks/global";
import { useNavigate } from "react-router-dom";

export function LoginProvider() {
  const { discovery_url, client_id, scope } = useContext(ProfileContext);
  useEffect(async () => {
    const discoveryDocument = await fetchJSON(discovery_url);
    const { authorization_endpoint } = discoveryDocument;
    const params = {
      response_type: "token",
      response_mode: "fragment",
      scope,
      client_id,
      redirect_uri: window.location.origin + "/login/google/callback",
    };
    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(params);
  }, []);
  return <h1>Please wait...</h1>;
}

async function sha256(string) {
  const binHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder("utf-8").encode(string)
  );

  //Return
}

export function LoginMicrosoft() {
  const { oauth_config } = useContext(ProfileContext);
  useEffect(async () => {
    const { discovery_url, client_id, scope } = oauth_config;
    const discoveryDocument = await fetchJSON(discovery_url);
    const { authorization_endpoint } = discoveryDocument;

    //const state = randomString(length)..
    //window.sessionStorage.setItem(state, state)

    //code_verifier = randomString(lenght)
    //window.sessionStorage.setItem(codeverifier, codeverifier)

    const params = {
      response_type: "code",
      response_mode: "fragment",
      //state
      //code_challenge: await sha256(codeverifier)
      code_challenge_method: "S256",
      scope,
      client_id,
      redirect_uri: window.location.origin + "/login/callback",
      // Redirect uri i tokenkallet også.
    };
    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(params);
  }, []);
  return <h1>Please wait</h1>;
}

export function LoginCallback({ reload }) {
  const navigate = useNavigate();
  useEffect(async () => {
    const { access_token, state } = Object.fromEntries(
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
  return <h1>Please wait</h1>;
}

export const ProfileContext = React.createContext({
  userinfo: undefined,
});
