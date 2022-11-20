import axios from "axios";
import React, { useState, useEffect } from "react";
import host from "../host";
import "./Card.css";

function Card(props) {
  const student = props.student;
  const trimesters = props.trimesters;
  const [selectedTrimester, setSelectedTrimester] =
    useState("Select Trimester");
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const getGradeCard = () => {
    axios
      .post(`${host}getGradeCard`, {
        newid: student.newid,
        idsyc: selectedTrimester,
      })
      .then((res) => {
        setGrades(res.data);
        renderGPA(res.data);
      });
  };

  const renderGPA = (grades) => {
    let total = 0;
    let totalUnits = 0;

    for (let i = 0; i < grades.length; i++) {
      total = (grades[i].grade ? grades[i].grade : 5) * grades[i].units + total;
      totalUnits = totalUnits + grades[i].units;
    }

    setGpa(total / totalUnits);
  };

  const cardRender = (grade, status) => {
    if (status === "INC") {
      return "inc";
    }
    if (status === "INC*") {
      return "inc";
    }
    if (grade == 5) {
      return "failed";
    }
    return "passed";
  };

  return (
    <div className="cardMainContainer">
      <div className="gradeCardTitle">
        <h1>Grade Card</h1>
      </div>

      <div className="selectTrimester">
        <select
          value={selectedTrimester}
          onChange={(e) => {
            setSelectedTrimester(e.target.value);
          }}
        >
          <option disabled>Select Trimester</option>
          {trimesters.map((val, key) => {
            return (
              <option key={key} value={val.idsyc}>
                {val.sy_name}
              </option>
            );
          })}
        </select>
        <button onClick={getGradeCard}>Verify Grade Card</button>
      </div>

      <div className="gradeCardContainer">
        {grades.map((val, key) => {
          return (
            <div
              key={key}
              className={`gradeCard ${cardRender(val.grade, val.status)}`}
            >
              <div className="gradeTitle">{val.subject_name}</div>
              <div className="gradeDesc">{val.description}</div>
              <div>Units: {val.units}</div>
              <div>
                Final Grade: <b>{val.grade.toFixed(2)}</b>
              </div>
              <div>Status: {val.status}</div>
            </div>
          );
        })}
      </div>

      <div className="gpa">
        GPA: <b>{gpa.toFixed(3)}</b>
      </div>
    </div>
  );
}

export default Card;
