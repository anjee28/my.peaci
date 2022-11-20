import { useState, useEffect } from "react";
import "./login.css";

function Login(props) {
  const [idNum, setIdNum] = useState("");
  const [pass, setPass] = useState("");
  const p = props;
  return (
    <div className="loginParent">
      <div className="logoDiv">
        <img src={p.logo} alt="" className="logoImg" />
        <h1>my.PEACI</h1>
      </div>
      <div className="loginInput">
        <input
          type="number"
          name=""
          id=""
          placeholder="ID Number"
          onChange={p.idNumInput}
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="password"
          onChange={p.passInput}
        />
        <button onClick={p.onLog} className="rounded-md bg-sky-400 py-2">
          Login
        </button>
      </div>
      <div className="footer">
        Developed by<b>Mellhabib M. Angni</b>
      </div>
    </div>
  );
}

export default Login;
