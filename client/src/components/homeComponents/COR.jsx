import React, { useState, useEffect } from "react";
import axios from "axios";
import host from "../host";
import "./COR.css";

function COR(props) {
  const student = props.student;
  const [cor, setCor] = useState([]);

  useEffect(() => {
    loadCor();
  }, []);

  const loadCor = () => {
    axios
      .post(`${host}getCOR`, {
        studentId: student.idstudent,
      })
      .then((res) => {
        setCor(res.data);
      });
  };

  const totalUnits = () => {
    let total = 0;
    for (let i = 0; i < cor.length; i++) {
      total = total + parseFloat(cor[i].units);
    }
    return total;
  };

  const renderCor = () => {
    if (cor.length === 0) {
      return <h1>You are not enrolled in the Current Trimester</h1>;
    } else {
      return (
        <React.Fragment>
          <div className="totalUnits">Total Units:{totalUnits()}</div>
          {cor.map((val, key) => {
            return (
              <div className="cor" key={key}>
                <div className="courseCode">
                  {val.subject_name}/{val.class_name}
                </div>
                <div className="description">{val.subject_description}</div>
                <div className="units">Units: {val.units}</div>
                <div className="room">Room: {val.roomname}</div>
                <div className="sched">Schedule: {val.schedule}</div>
                <div className="instructor">Instructor: {val.instructor}</div>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  };
  return (
    <React.Fragment>
      <div className="corTitle">
        <h1>Certificate of Registration</h1>
      </div>

      <div className="corContainer">{renderCor()}</div>
    </React.Fragment>
  );
}

export default COR;
