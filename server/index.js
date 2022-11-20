const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "oldsql",
  host: "192.168.0.102",
  password: "root",
  database: "peaci",
  multipleStatements: true,
});

//req=request, res=response
app.get("/loadSubjects", (req, res) => {
  db.query("SELECT * FROM subject ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.use(express.static("public"));
app.use("/images", express.static("//192.168.0.102/Docs/Odin Project/shared"));

app.get("/loadTrimesters", (req, res) => {
  db.query("SELECT * FROM syc", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/loadCurrentTrimester", (req, res) => {
  db.query(
    "SELECT sy_name FROM syc ORDER BY idsyc DESC LIMIT 1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/loadCourses", (req, res) => {
  db.query("SELECT * FROM course", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/loadUserCourse", (req, res) => {
  const idStudent = req.body.idStudent;
  db.query(
    "SELECT course.course, course.description FROM student JOIN course ON course.idcourse = student.idcourse WHERE newid = ?",
    [idStudent],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/loadOfferedSubjects", (req, res) => {
  const idstudent = req.body.idstudent;
  db.query(
    "SELECT subject.subject_name, classs.class_name, subject.description, classs.instructor, classs.schedule, classs.enrolledCount, classs.slot, room.roomname FROM peaci.classs JOIN subject ON classs.idsubject = subject.idsubject JOIN room ON classs.idroom = room.idroom WHERE  idsyc = (SELECT idsyc FROM syc ORDER BY idsyc DESC LIMIT 1) AND classs.idsubject IN (SELECT idsubject FROM subject_course where idcourse = (SELECT idcourse FROM student WHERE idstudent = ?)) AND classs.idsubject NOT IN (SELECT idsubject FROM completedsubject where idstudent = ?)  ORDER BY subject_name, class_name ASC;",
    [idstudent, idstudent],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/getStudent", (req, res) => {
  const newId = req.body.newId;

  db.query("SELECT * FROM student WHERE newid=?", [newId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/getSubjCourse", (req, res) => {
  const studentId = req.body.studentId;
  db.query(
    "SELECT subject.idsubject, subject.subject_name, subject.description, subject_course.semester, MIN(completedsubject.grade) AS grade FROM subject_course JOIN subject ON subject_course.idsubject = subject.idsubject LEFT JOIN completedsubject ON subject_course.idsubject = completedsubject.idsubject AND (completedsubject.idstudent = ?) WHERE subject_course.idcourse = (SELECT idcourse FROM student WHERE idstudent = ?) GROUP BY subject.idsubject ORDER BY subject_course.semester DESC, subject.subject_name ASC ",
    [studentId, studentId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/checkAkan", (req, res) => {
  const studentidno = req.body.studentIdInput;
  const password = req.body.passInput;
  db.query(
    "SELECT * FROM studentakan WHERE studentidno=?",
    [studentidno, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length !== 1) {
          res.send("0");
        } else {
          if (result[0].password === password) {
            res.send("1");
          } else {
            res.send("2");
          }
        }
      }
    }
  );
});

app.post("/getCOR", (req, res) => {
  const studentId = req.body.studentId;

  db.query(
    "SELECT subject.subject_name, classs.class_name, subject.units, subject.description AS 'subject_description', classs.schedule, room.roomname, classs.instructor, room.description AS 'room_description' FROM enrolled2 JOIN enrolled_subject ON enrolled_subject.idenrolled2 = enrolled2.idenrolled2 JOIN subject on enrolled_subject.idsubject = subject.idsubject JOIN classs on enrolled_subject.idclass = classs.idclass JOIN room on classs.idroom = room.idroom WHERE idstudent = ? AND enrolled2.idsyc = (SELECT idsyc FROM syc ORDER BY idsyc DESC LIMIT 1);",
    [studentId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/getINC", (req, res) => {
  const studentId = req.body.studentId;

  db.query(
    "SELECT grade, instructor, subject_name, description, sy_name, ((SELECT idsyc FROM syc ORDER BY idsyc DESC LIMIT 1) - syc.idsyc) AS trimesters FROM enrolled_subject JOIN enrolled2 ON enrolled_subject.idenrolled2 = enrolled2.idenrolled2 JOIN subject ON enrolled_subject.idsubject = subject.idsubject JOIN classs ON enrolled_subject.idclass = classs.idclass JOIN syc ON enrolled2.idsyc = syc.idsyc WHERE enrolled2.idstudent = ? AND enrolled_subject.status LIKE '%INC%';",
    [studentId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/getEmpire", (req, res) => {
  const newid = req.body.newid;

  db.query(
    "SELECT empire.empirename, empire.idempire FROM empirestudadvisee JOIN empire ON empire.idempire = empirestudadvisee.idempire WHERE idstudent = (SELECT idstudent FROM student WHERE newid = ?);",
    [newid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/getAdviser", (req, res) => {
  const newid = req.body.newid;

  db.query(
    "SELECT firstname, middleinitial, lastname FROM peaci.faculty WHERE idfaculty = (SELECT idadviser FROM student WHERE newid = ?);",
    [newid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/loadAllUnits", (req, res) => {
  const newid = req.body.newid;

  db.query(
    "SELECT units FROM subject WHERE idsubject IN (SELECT idsubject FROM peaci.subject_course WHERE idcourse = (SELECT idcourse FROM student WHERE newid = ?));",
    [newid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/loadCompletedUnits", (req, res) => {
  const newid = req.body.newid;

  db.query(
    "SELECT subject.units FROM completedsubject JOIN subject ON subject.idsubject = completedsubject.idsubject WHERE idstudent = (SELECT idstudent FROM student WHERE newid = ?);",
    [newid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/changePassword", (req, res) => {
  const newid = req.body.newid;
  const newPass = req.body.newPass;

  db.query(
    "SET @idakan = (SELECT idstudentakan FROM studentakan WHERE studentidno = ?); UPDATE studentakan SET password = ? WHERE idstudentakan = @idakan;",
    [newid, newPass]
  );
});

app.post("/getGradeCard", (req, res) => {
  const newid = req.body.newid;
  const idsyc = req.body.idsyc;

  db.query(
    "SELECT subject.subject_name, subject.description, subject.units, enrolled_subject.grade, enrolled_subject.status FROM enrolled_subject JOIN subject ON subject.idsubject = enrolled_subject.idsubject WHERE idenrolled2 = (SELECT idenrolled2 FROM enrolled2 WHERE idstudent = (SELECT idstudent FROM student WHERE newid = ?) AND idsyc = ?);",
    [newid, idsyc],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
