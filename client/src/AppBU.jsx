import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const host = "http://192.168.0.102:3001/";
  const [studentId, setStudentId] = useState("");
  const [newId, setNewId] = useState("");
  const [student, setStudent] = useState({ middle_name: " " });
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [trimesters, setTrimesters] = useState([]);
  const [selectedTrimester, setSelectedTrimester] = useState("");
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    axios.get(`${host}loadSubjects`).then((res) => {
      setSubjects(res.data);
    });
    axios.get(`${host}loadTrimesters`).then((res) => {
      setTrimesters(res.data);
    });
    axios.get(`${host}loadCourses`).then((res) => {
      setCourses(res.data);
    });
  }, []);

  function getStudent() {
    axios
      .post(`${host}getStudent`, {
        newId: newId,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          setStudent(res.data[0]);

          setStudentId(res.data[0].idstudent);
          getGrades(res.data[0].idstudent);
        } else {
          alert("ERROR! ID Number not found!");
        }
      });
  }

  function getGrades(idStudent) {
    axios
      .post(`${host}getGrades`, {
        studentId: idStudent,
        trimester: selectedTrimester,
      })
      .then((res) => {
        setGrades(res.data);
        computeGPA(res.data);
      });
  }

  function searchSubject(idsubject) {
    let subject = subjects.filter((obj) => obj.idsubject === idsubject);
    return subject[0];
  }

  function computeGPA(grades) {
    let sumGPA = 0;
    let totalUnits = 0;
    let gpa = 0;
    for (let i = 0; i < grades.length; i++) {
      totalUnits = totalUnits + searchSubject(grades[i].idsubject).units;
    }
    for (let i = 0; i < grades.length; i++) {
      sumGPA =
        grades[i].grade * searchSubject(grades[i].idsubject).units + sumGPA;
    }
    gpa = sumGPA / totalUnits;
    gpa = Math.round(gpa * 100) / 100;

    setGpa(gpa);
  }

  return (
    <div className="App">
      <div className="input">
        <input
          type="number"
          name="studentId"
          id="studentId"
          placeholder="ID Number"
          onChange={(e) => {
            setNewId(e.target.value);
          }}
        />
        <select
          onClick={(e) => {
            setSelectedTrimester(e.target.value);
          }}
        >
          {trimesters.map((val, key) => {
            return <option key={key}>{val.sy_name}</option>;
          })}
        </select>
        <button onClick={getStudent}>Search</button>
      </div>
      <div className="grades">
        <div>
          Name: {student.last_name}, {student.first_name}{" "}
          {student.middle_name.charAt(0)}.
        </div>
        <div>GPA: {gpa}</div>
        {grades.map((val, key) => {
          return (
            <div className="subjects" key={key}>
              <div className="units">{searchSubject(val.idsubject).units}</div>
              <div className="subjectName">
                {searchSubject(val.idsubject).subject_name}
              </div>
              <div className="subjectDesc">
                {searchSubject(val.idsubject).description}
              </div>
              <div className="subjectGrade">{val.grade}</div>

              <div className="subjectTrim">{val.semYear}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
