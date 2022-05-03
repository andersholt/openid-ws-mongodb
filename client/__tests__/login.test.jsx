import React from "react";
import {LoginPage} from "../src/pages/loginpage/loginPage";
import {MemoryRouter} from "react-router-dom";
import ReactDOM from "react-dom";
import {act, Simulate} from "react-dom/test-utils";

describe("login page", () => {
    it("redirect to log in with google", async () => {
        // replace window.location to be able to detect redirects
        const location = new URL("https://www.example.com");
        delete window.location;
        window.location = new URL(location);

        const authorization_endpoint = `https://www.example.com/`;
        const client_id = `1095582733852-smqnbrhcoiasjjg8q28u0g1k3nu997b0.apps.googleusercontent.com`;

        const domElement = document.createElement("div");
        ReactDOM.render(
            <MemoryRouter>
                <LoginPage/>
            </MemoryRouter>,
            domElement
        );

        console.log(domElement.querySelector("a"))

        const node1 = domElement.querySelector("a:nth-child(1)")
        const node2 = domElement.querySelector("a:nth-child(2)")

        expect(node1.text).toEqual(
            "Google login"
        );
        await act(async () => {
            await Simulate.click(node1);
        });
        const redirect_uri = `${location.origin}/login/google/callback`;

        expect(window.location.origin + window.location.pathname).toEqual(
            authorization_endpoint
        );
    });
});