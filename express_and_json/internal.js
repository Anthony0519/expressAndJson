// working with express
// import express library
const express = require("express");

const port = 4000;
const host = "localhost";




// create a server
const app = express();
app.use(express.json());

// send a get request
app.get("/", (req, res) => {
  res.send("Welcome to backend API");
});

// get all the students.
app.get("/students", (req, res) => {
  res.status(200).json({
    data: studentData,
  });
});

// get a single student
app.get("/students/:id", (req, res) => {
  // get the student id from the url
  const studentId = parseInt(req.params.id);

  // tract the student with the id passed to the url
  const student = studentData.find((student) => student.id === studentId);

  // show the student by tracking for errors.
  if (!student) {
    res.status(404).json({
      message: "Student not found.",
    });
  } else {
    res.status(200).json({
      data: student,
    });
  }
});

// create a new student
app.post("/students", (req, res) => {
  const student = req.body;

  // automate the student id;
  student.id = studentData.length + 1;

  // push the new student in the database
  const newStudent = studentData.push(student);

  // check
  if (!newStudent) {
    res.status(400).json({
      message: "Error creating student",
    });
  } else {
    // show  response
    res.status(201).json({
      data: student,
    });
  }
});

// update a student
app.put("/students/:id", (req, res) => {
  // get the student id
  const studentId = parseInt(req.params.id);

  // get the student content
  const student = req.body;

  // iterate through the students database
  for (let i = 0; i < studentData.length; i++) {
    if (studentData[i].id === studentId) {
      studentData[i] = { ...studentData[i], ...student };
      res.status(200).json({
        message: "Updated successfully",
        data: studentData[i],
      });
    }
  }
  res.status(404).json({
    message: `Student with id: ${studentId} is not found.`,
  });
});

// delete a student
app.delete("/students/:id", (req, res) => {
  // get the student
  const studentId = parseInt(req.params.id);

  studentData = studentData.filter((student) => student.id != studentId);
  res.status(200).json({
    message: "Student deleted successfully",
    data: studentData,
  });
});

// listen to the server
app.listen(port, () => {
  console.log(`Server is listening on: ${host}:${port}`);
});