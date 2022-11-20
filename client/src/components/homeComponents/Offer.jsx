import axios from "axios";
import React, { useState, useEffect } from "react";
import host from "../host";
import "./Offer.css";

function Offer(props) {
  const [offeredSubject, setOfferedSubject] = useState([]);

  const student = props.student;
  const trimesters = props.trimesters;

  useEffect(() => {
    loadOffered();
  }, []);

  const loadOffered = () => {
    axios
      .post(`${host}loadOfferedSubjects`, {
        idstudent: student.idstudent,
      })
      .then((res) => {
        setOfferedSubject(res.data);
      });
  };

  const renderSlots = (slot) => {
    if (slot === 0) {
      return (
        <div>
          Open Slots:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>{slot}</span>
        </div>
      );
    } else {
      return (
        <div>
          Open Slots:{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>{slot}</span>
        </div>
      );
    }
  };

  const renderOffered = () => {
    if (offeredSubject.length === 0) {
      return <div>There are no subjects offered for you right now</div>;
    } else {
      return (
        <React.Fragment>
          {offeredSubject.map((val, key) => {
            return (
              <div className="subject" key={key}>
                <div className="subjectName">{val.subject_name}</div>
                <div>Section: {val.class_name}</div>
                <div className="subjectDescription">{val.description}</div>
                {renderSlots(val.slot - val.enrolledCount)}
                <div>
                  Instructor:{" "}
                  <span style={{ fontWeight: "bold" }}>{val.instructor}</span>
                </div>
                <div>Room: {val.roomname}</div>
                <div>Schedule: {val.schedule}</div>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  };

  return (
    <React.Fragment>
      <div className="offerTitle">
        <h1>Offered Subjects</h1>
        <div>{trimesters[trimesters.length - 1].sy_name}</div>
      </div>

      <div className="subjectsOffered">{renderOffered()}</div>
    </React.Fragment>
  );
}

export default Offer;
