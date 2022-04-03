import React, { useContext, useEffect, useState } from "react";
import { fetchJSON } from "../hooks/global";
import { Link, useNavigate } from "react-router-dom";

export const ProfileContext = React.createContext({
  userinfo: undefined,
});

export function LoginProvider() {
  console.log(useContext(ProfileContext));
  const { google } = useContext(ProfileContext).config;

  useEffect(async () => {
    const { discovery_url, client_id, scope } = google;
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
  const binaryHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder("utf-8").encode(string)
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(binaryHash)))
    .split("=")[0]
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function randomString(length) {
  const possible = "ABCDEFGIKJKNKLBIELILNLA01234456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

export function LoginMicrosoft() {
  console.log(useContext(ProfileContext));
  const { microsoft } = useContext(ProfileContext).config;

  useEffect(async () => {
    const { discovery_url, client_id, scope, response_type } = microsoft;
    console.log(discovery_url);
    const discoveryDocument = await fetchJSON(discovery_url);
    const { authorization_endpoint } = discoveryDocument;

    const state = randomString(50);
    window.sessionStorage.setItem("expected_state", state);
    const code_verifier = randomString(50);
    window.sessionStorage.setItem("code_verifier", code_verifier);
    const parameters = {
      response_type,
      response_mode: "fragment",
      client_id,
      scope,
      state,
      code_challenge: await sha256(code_verifier),
      code_challenge_method: "S256",
      redirect_uri: window.location.origin + "/login/microsoft/callback",
    };

    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(parameters);
  }, []);

  return (
    <div>
      <h1>Please wait....</h1>
    </div>
  );
}

export function LoginCallbackMicrosoft({ reload }) {
  const [error, setError] = useState();
  const navigate = useNavigate();

  const { microsoft } = useContext(ProfileContext).config;

  const { discovery_url, client_id } = microsoft;
  useEffect(async () => {
    const expectedState = window.sessionStorage.getItem("expected_state");
    const { access_token, error, error_description, state, code, scope } =
      Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );

    let accessToken = access_token;

    if (expectedState !== state) {
      setError("Unexpected redirect (state mismatch)");
      return;
    }

    if (error || error_description) {
      setError(`Error: ${error} ${error_description}`);
      return;
    }

    if (code) {
      const { token_endpoint } = await fetchJSON(discovery_url);
      const code_verifier = window.sessionStorage.getItem("code_verifier");

      const tokenResponse = await fetch(token_endpoint, {
        method: "POST",
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id,
          code_verifier,
          redirect_uri: window.location.origin + "/login/microsoft/callback",
        }),
      });
      if (tokenResponse.ok) {
        const { access_token } = await tokenResponse.json();
        accessToken = access_token;
      } else {
        setError(`token response ${await tokenResponse.text()}`);
        return;
      }
    }

    if (!accessToken) {
      setError("Missing access token");
      return;
    }

    const res = await fetch("/api/login", {
      method: "post",
      body: new URLSearchParams({ access_token: accessToken }),
    });

    if (res.ok) {
      reload();
      navigate("/");
    } else {
      setError(`Failed POST /api/login: ${res.status} ${res.statusText}`);
    }
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error}</div>
        <Link to={"/"}>Front page</Link>
      </div>
    );
  }

  return <h1>Please wait...</h1>;
}

export function LoginCallbackGoogle({ reload }) {
  const [error, setError] = useState();

  const navigate = useNavigate();
  useEffect(async () => {
    const { access_token } = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1))
    );
    const res = await fetch("/api/login", {
      method: "post",
      body: new URLSearchParams({ access_token }),
    });
    if (res.ok) {
      reload();
      navigate("/");
    } else {
      setError(`Failed POST /api/login: ${res.status} ${res.statusText}`);
    }
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error}</div>
        <Link to={"/"}>Front page</Link>
      </div>
    );
  }

  return <h1>Please wait...</h1>;
}
