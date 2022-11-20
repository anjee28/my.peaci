import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import host from "../host";
import "./GradeCard.css";

function GradeCard(props) {
  const semesters = [
    "First Year - 1st Trimester",
    "First Year - 2nd Trimester",
    "First Year - 3rd Trimester",
    "Second Year - 1st Trimester",
    "Second Year - 2nd Trimester",
    "Second Year - 3rd Trimester",
    "Third Year - 1st Trimester",
    "Third Year - 2nd Trimester",
    "Third Year - 3rd Trimester",
    "Fourth Year - 1st Trimester",
    "Fourth Year - 2nd Trimester",
    "Fourth Year - 3rd Trimester",
  ];
  const student = props.student;
  const [grades, setGrades] = useState([{ semester: 0 }]);

  useEffect(() => {
    getSubjCourse();
  }, []);

  const getSubjCourse = () => {
    axios
      .post(`${host}getSubjCourse`, {
        studentId: student.idstudent,
      })
      .then((res) => {
        setGrades(res.data);
      });
  };

  const renderGrades = (grade) => {
    if (grade == null) {
      return "";
    }
    if (grade === 9) {
      return "INC";
    }
    if (grade) {
      return grade.toFixed(2);
    }
    //return grade ? grade.toFixed(2) : "";
  };

  return (
    <React.Fragment>
      <div className="mainContainer">
        <div className="evaluationTitle">
          <h1>Student Evaluation</h1>
        </div>
        <div className="evaluationContainer">
          {semesters.map((val, key) => {
            if (key <= grades[0].semester) {
              return (
                <div className="trimGradeCont" key={key}>
                  <div className="trimester">{val}</div>
                  <div className="subjectsContainer">
                    <div className="subj tableHead">
                      <div className="subjName">Course Code</div>
                      <div className="subjDesc">Description</div>
                      <div className="subjGrade">Grade</div>
                    </div>
                    {grades
                      .filter((val) => val.semester === key)
                      .map((val, key) => {
                        return (
                          <div className="subj" key={key}>
                            <div className="subjName">{val.subject_name}</div>
                            <div className="subjDesc">{val.description}</div>
                            <div className="subjGrade">
                              {renderGrades(val.grade)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default GradeCard;
