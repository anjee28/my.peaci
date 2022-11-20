import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import Profile from "./homeComponents/Profile";
import COR from "./homeComponents/COR";
import GradeCard from "./homeComponents/GradeCard"; //Evaluation
import Offer from "./homeComponents/Offer";
import Inc from "./homeComponents/Inc";
import Card from "./homeComponents/Card";
import menu from "../assets/svg/menu.svg";
import host from "./host";

function Home(props) {
  const sidebar = document.getElementById("sidebar");
  const navBut = document.querySelectorAll(".navButton");

  const [student, setStudent] = useState({
    first_name: "test",
    middle_name: "test",
  });

  const [userCourse, setUserCourse] = useState({
    course: "Loading Course",
    description: "Loading Course",
  });

  const [activeComp, setActiveComp] = useState(1);
  const [trimesters, setTrimesters] = useState([]);

  useEffect(() => {
    loadStudent();
    loadTrimesters();
    loadCourse();
  }, []);

  const loadTrimesters = () => {
    axios.get(`${host}loadTrimesters`).then((res) => {
      setTrimesters(res.data);
    });
  };

  const sidebarToggle = () => {
    const sideClassName = sidebar.className;

    if (sideClassName === "sidebar close") {
      sidebar.setAttribute("class", "sidebar open");
      navExpandCondition("open");
    } else {
      sidebar.setAttribute("class", "sidebar close");
      navExpandCondition("close");
    }
  };

  const sidebarCollapse = () => {
    sidebar.setAttribute("class", "sidebar close");
    navExpandCondition("close");
  };

  const loadStudent = () => {
    axios
      .post(`${host}getStudent`, {
        newId: props.studentId,
      })
      .then((res) => {
        if (res.data[0].lrnno === "") {
          let newdata = res.data[0];
          newdata.lrnno = "LRN not found";
          setStudent(newdata);
        }
        setStudent(res.data[0]);
      });
  };
  const loadCourse = () => {
    axios
      .post(`${host}loadUserCourse`, {
        idStudent: props.studentId,
      })
      .then((res) => {
        setUserCourse(res.data[0]);
      });
  };

  const loadComponent = () => {
    switch (activeComp) {
      case 1:
        return (
          <Profile
            student={student}
            userCourse={userCourse}
            studentId={props.studentId}
          />
        );

      case 2:
        return <COR student={student} />;

      case 3:
        return <GradeCard student={student} />; //Evaluation

      case 4:
        return <Offer student={student} trimesters={trimesters} />;

      case 5:
        return <Inc student={student} />;

      case 6:
        return (
          <Card
            student={student}
            trimesters={trimesters}
            studentId={props.studentId}
          />
        );

      default:
        return <Profile student={student} userCourse={userCourse} />;
    }
  };

  const switchComp = (val) => {
    setActiveComp(val);
    sidebarCollapse();
    activeCompNav();
    const targetDiv = document.getElementById(val);
    targetDiv.classList.replace("inactive", "active");
  };

  const activeCompNav = () => {
    for (let i = 0; i < navBut.length; i++) {
      navBut[i].classList.replace("active", "inactive");
    }
  };

  const navExpandCondition = (val) => {
    if (val === "open") {
      navExpand("close", "open");
    } else {
      navExpand("open", "close");
    }
  };

  const navExpand = (currentVal, newVal) => {
    for (let i = 0; i < navBut.length; i++) {
      navBut[i].classList.remove(currentVal);
      navBut[i].classList.add(newVal);
    }
  };

  return (
    <div className="parent">
      <div className="main">{loadComponent()}</div>
      <div className="sidebar close" id="sidebar">
        <div className="collapse" onClick={sidebarToggle}>
          <img src={menu} alt="" className="menuIcon" />
        </div>
        <div
          className="navButton close active"
          onClick={(val) => switchComp(1)}
          id="1"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
          <p>Student Profile</p>
        </div>
        <div
          className="navButton close inactive"
          onClick={(val) => switchComp(2)}
          id="2"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 14H8V20H2M16 8H10V10H16M2 10H8V4H2M10 4V6H22V4M10 20H16V18H10M10 16H22V14H10"
            />
          </svg>
          <p>Certificate of Registration</p>
        </div>
        <div
          className="navButton close inactive"
          onClick={(val) => switchComp(4)}
          id="4"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13,12H20V13.5H13M13,9.5H20V11H13M13,14.5H20V16H13M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M21,19H12V6H21"
            />
          </svg>
          <p>Offered Subjects</p>
        </div>
        <div
          className="navButton close inactive"
          onClick={(val) => switchComp(3)}
          id="3"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H7V11H10V13M14,13H11V11H14V13M10,16H7V14H10V16M14,16H11V14H14V16M10,19H7V17H10V19M14,19H11V17H14V19Z"
            />
          </svg>
          <p>Student Evaluation</p>
        </div>
        <div
          className="navButton close inactive"
          onClick={(val) => switchComp(6)}
          id="6"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12,15H10V13H12V15M18,15H14V13H18V15M8,11H6V9H8V11M18,11H10V9H18V11M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4Z"
            />
          </svg>
          <p>Grade Card</p>
        </div>
        <div
          className="navButton close inactive"
          onClick={(val) => switchComp(5)}
          id="5"
        >
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H9.18C9.6,1.84 10.7,1 12,1C13.3,1 14.4,1.84 14.82,3H19M12,3A1,1 0 0,0 11,4A1,1 0 0,0 12,5A1,1 0 0,0 13,4A1,1 0 0,0 12,3M7,7V5H5V19H19V5H17V7H7M11,9H13V13.5H11V9M11,15H13V17H11V15Z"
            />
          </svg>
          <p>INC Monitor</p>
        </div>
        <div className="navButton logout close inactive" onClick={props.onLog}>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
            />
          </svg>
          <p>Sign Out</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
