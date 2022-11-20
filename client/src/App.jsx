import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Login from "./components/Login";
import Home from "./components/Home";
import logo from "./assets/logoMain.png";
import host from "./components/host";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [idNumInput, setIdNumInput] = useState(0);
  const [passInput, setPassInput] = useState("");
  const [studentId, setStudentId] = useState(0);

  const navbar = document.getElementById("navbar");
  const logos = document.getElementById("logosDiv");
  const navName = document.getElementById("navName");

  window.onscroll = function () {
    windowScroll();
  };

  function windowScroll() {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navbar.style.height = "5%";
      navbar.style.fontSize = "1rem";
      navName.style.opacity = 1;
    } else {
      navbar.style.height = "10%";
      navbar.style.fontSize = "1.35rem";
      navName.style.opacity = 0;
    }

    console.log(document.documentElement.scroll);
  }

  useEffect(() => {
    const sessionId = sessionStorage.getItem("studentId");

    if (sessionId !== null) {
      setLoggedIn(true);
      setStudentId(sessionId);
    }
  }, []);

  const idNumInputChange = (e) => {
    setIdNumInput(e.target.value);
  };

  const passInputChange = (e) => {
    setPassInput(e.target.value);
  };

  const akanAuthCheck = () => {
    axios
      .post(`${host}checkAkan`, {
        studentIdInput: idNumInput,
        passInput: passInput,
      })
      .then((res) => {
        switch (res.data) {
          case 0:
            alert(
              "You have either entered a wrong ID Number or you haven't paid the AKAN Fee yet"
            );
            break;
          case 1:
            alert("You have successfully logged in!");

            sessionStorage.setItem("studentId", idNumInput);

            setLoggedIn(true);
            setStudentId(idNumInput);
            break;
          case 2:
            alert("ID Number and password did not match");
            break;
          default:
            alert("Unknown Error, Please contact the developer");
            break;
        }
      });
  };

  const login = () => {
    if (loggedIn) {
      setLoggedIn(false);
      setPassInput("");
      sessionStorage.clear();
    } else {
      akanAuthCheck();
    }
  };

  const loggedCheck = () => {
    if (loggedIn) {
      return <Home onLog={login} studentId={studentId} />;
    } else {
      return (
        <Login
          onLog={login}
          logo={logo}
          idNumInput={idNumInputChange}
          passInput={passInputChange}
        />
      );
    }
  };

  return (
    <div className="App">
      <div>{loggedCheck()}</div>
    </div>
  );
}

export default App;
