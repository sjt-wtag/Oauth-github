import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

const CLIENT_ID = "Ov23liOZBgb8s4RKzXCu";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const condeParam = urlParams.get("code");
    console.log(condeParam);
    if (condeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + condeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }

      getAccessToken();
    }
  }, []);

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"), // Bearer ACCESSTOKEN
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data);
      });
  }

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ? (
          <>
            <h1> We have the access token </h1>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                setRerender(!rerender);
              }}
              className="button"
            >
              {" "}
              Log out{" "}
            </button>
            <h3> Get User Data from GitHub API </h3>
            <button onClick={getUserData} className="button">
              {" "}
              Get Data in the console{" "}
            </button>
          </>
        ) : (
          <>
            <h3>User is not logged in</h3>

            <button onClick={loginWithGithub} className="button">
              Login with github
            </button>
            {Object.keys(userData).length !== 0 ? (
              <>
                {" "}
                <h4> Hey there {userData.login}</h4>{" "}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
