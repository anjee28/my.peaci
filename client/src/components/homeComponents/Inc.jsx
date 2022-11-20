import axios from "axios";
import React, { useState, useEffect } from "react";
import host from "../host";
import "./Inc.css";
function Inc(props) {
  const student = props.student;
  const [inc, setInc] = useState([]);

  useEffect(() => {
    loadInc();
  }, []);

  const loadInc = () => {
    axios
      .post(`${host}getINC`, {
        studentId: student.idstudent,
      })
      .then((res) => {
        setInc(res.data);
      });
  };

  const renderStatus = (grade, trimesters) => {
    if (grade === 5) {
      return "Lapsed";
    }
    if (grade > 0) {
      return "Completed";
    }
    if (trimesters > 3) {
      return "Lapsed";
    }
    return "Incomplete";
  };

  const renderGrade = (grade) => {
    if (grade === 0) {
      return "INC";
    } else {
      return grade;
    }
  };

  const renderLegend = (grade, trimesters) => {
    if (grade > 0 && grade < 5) {
      return "green";
    }
    if (trimesters >= 4) {
      return "red";
    }
    if (trimesters === 3) {
      return "orange";
    }
    if (trimesters === 2) {
      return "yellow";
    }
    if (trimesters === 1) {
      return "blue";
    }
  };

  return (
    <div className="incMain">
      <div className="incTitle">INC Monitor</div>
      <div className="legendContainer">
        <div className="legendTitle">Legend:</div>
        <div className="legends">
          <div className="legend green">Completed</div>
          <div className="legend blue">New INC</div>
          <div className="legend yellow">After 1 Trimester</div>
          <div className="legend orange">After 2 Trimester</div>
          <div className="legend red">Lapsed</div>
        </div>
      </div>
      <div className="incContainer">
        {inc.map((val, key) => {
          return (
            <div
              className={
                renderLegend(val.grade, val.trimesters) + " incSubjContainer"
              }
              key={key}
            >
              <div>{val.subject_name}</div>
              <div>{val.description}</div>
              <div>{val.sy_name}</div>
              <div>Instructor: {val.instructor}</div>
              <div>Final Grade: {renderGrade(val.grade)}</div>
              <div>status: {renderStatus(val.grade, val.trimesters)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inc;
