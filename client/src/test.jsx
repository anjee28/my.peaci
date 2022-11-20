import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const host = "http://192.168.0.102:3001/";
  let studentId;
  let subjects;
  let courses;

  const [newId, setNewId] = useState("");
  const [student, setStudent] = useState({ middle_name: "" });
  const [grades, setGrades] = useState([]);
  const [trimesters, setTrimesters] = useState([]);
  const [selectedTrimester, setSelectedTrimester] = useState();
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    axios.get(`${host}loadSubjects`).then((res) => {
      subjects = res.data;
      console.log(subjects);
    });
  }, []);

  return (
    <div className="App">
      <div className="input"></div>
    </div>
  );
}
export default App;
