import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import host from "../host";
import imgLoc from "./imgLoc";

function Profile(props) {
  const student = props.student;
  const userCourse = props.userCourse;
  const [empire, setEmpire] = useState([]);
  const [adviser, setAdviser] = useState({
    firstname: "Loading Adivser",
    middleinitial: "",
    lastname: "",
  });
  const [totalUnits, setTotalUnits] = useState(0);
  const [completedUnits, setCompletedUnits] = useState(0);
  const [changePassState, setChangePassState] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [newPassVerify, setNewPassVerify] = useState("");

  useEffect(() => {
    getEmpire();
    getAdviser();
    loadAllUnits();
    loadCompletedUnits();
  }, []);

  const getEmpire = () => {
    axios
      .post(`${host}getEmpire`, {
        newid: props.studentId,
      })
      .then((res) => {
        setEmpire(res.data);
      });
  };

  const getAdviser = () => {
    axios
      .post(`${host}getAdviser`, {
        newid: props.studentId,
      })
      .then((res) => {
        setAdviser(res.data[0]);
      });
  };

  const loadAllUnits = () => {
    axios
      .post(`${host}loadAllUnits`, {
        newid: props.studentId,
      })
      .then((res) => {
        let total = 0;
        for (let i = 0; i < res.data.length; i++) {
          total = total + res.data[i].units;
        }
        setTotalUnits(total);
      });
  };

  const loadCompletedUnits = () => {
    axios
      .post(`${host}loadCompletedUnits`, {
        newid: props.studentId,
      })
      .then((res) => {
        let total = 0;
        for (let i = 0; i < res.data.length; i++) {
          total = total + res.data[i].units;
        }
        setCompletedUnits(total);
      });
  };

  const renderEmpire = () => {
    if (empire.length === 0) {
      return "TBA";
    } else {
      return empire[0].empirename;
    }
  };

  const studentImg = () => {
    return `${imgLoc}${props.studentId}.jpg`;
  };

  const newPassInput = (e) => {
    setNewPass(e.target.value);
  };

  const newPassVerifyInput = (e) => {
    setNewPassVerify(e.target.value);
  };

  const renderPassword = () => {
    if (changePassState) {
      return (
        <React.Fragment>
          <div>
            <input
              className="newPassInput"
              type="password"
              placeholder="Enter New Password"
              onChange={newPassInput}
            />
          </div>
          <div>
            <input
              className="newPassInput"
              type="password"
              placeholder="Verify New Password"
              onChange={newPassVerifyInput}
            />
          </div>
          <div className="applyDiv">
            <button className="applyPass" onClick={changePassword}>
              Apply
            </button>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div>*****************</div>
          <div className="changePassword" onClick={changePassword}>
            Change Password
          </div>
        </React.Fragment>
      );
    }
  };

  const changePassword = () => {
    if (changePassState) {
      if (newPass === newPassVerify) {
        axios
          .post(`${host}changePassword`, {
            newid: props.studentId,
            newPass: newPass,
          })
          .then(
            setChangePassState(false),
            alert("Password Changed Successfully!")
          );
      } else {
        alert("Password does not match! Please enter again.");
      }
    } else {
      setChangePassState(true);
    }
  };

  return (
    <div className="profileMain">
      <div className="profileTitle">Student's Profile</div>
      <div
        className="dp"
        style={{ backgroundImage: `url(${studentImg()})` }}
      ></div>
      <div className="profile">
        <div className="cardTitle">Basic Information</div>
        <div className="studentName">
          {`${student.first_name} ${student.middle_name.charAt(0)}.${" "} ${
            student.last_name
          }`}
        </div>
        <div>ID Number: {student.newid}</div>
        <div>
          Adviser: {adviser.firstname} {adviser.middleinitial.charAt(0)}
          {". "}
          {adviser.lastname}
        </div>
        <div>Empire: {renderEmpire()}</div>
      </div>
      <div className="statusContainer">
        <div className="cardTitle">Login Details</div>
        <div className="password">
          <div className="key">Password</div>
          <div className="value">{renderPassword()}</div>
        </div>
      </div>
      <div className="statusContainer">
        <div className="cardTitle">Academic Information</div>
        <div className="object">
          <div className="key">LRN</div>
          <div className="value">
            <b>{student.lrnno}</b>
          </div>
        </div>
        <div className="object">
          <div className="key">Course</div>
          <div className="value">
            <div>{userCourse.course}</div>
            <div>{userCourse.description}</div>
          </div>
        </div>
        <div className="object">
          <div className="key">Standing</div>
          <div className="value">{student.yearlevel}</div>
        </div>
        <div className="object">
          <div className="key">Scholarship</div>
          <div className="value">{student.scholarship}</div>
        </div>
        <div className="object">
          <div className="key">Progress</div>
          <div className="value progress">
            <div style={{ fontWeight: 600 }}>
              {((completedUnits / totalUnits) * 100).toFixed(2)}%{" "}
            </div>
            <div>
              {completedUnits} out of {totalUnits} Units Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
