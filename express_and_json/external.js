const express = require("express");
const fs = require("fs");

const port = 6000;
const app = express();
app.use(express.json());

// use the instance to create our endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to our new json external file",
  });
});

// file path
const filePath = "./testData.json";

// function that writes to a json file
const writeToFile = async (data) => {
  try {
    await fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.err(`Something went wrong. ${err.message}`);
  }
};

// read from a file
const readFromFile = async () => {
  try {
    const data = await fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Something went wrong. ${err.message}`);
  }
};

// CRUD functionality
// create a new student

app.post('/students', async (req,res)=>{
    const newStudent = req.body

    const student = await readFromFile()

    newStudent.id = student.length +1

    student.push(newStudent)

    await writeToFile(student)

    res.status(200).json({
        data: student
    })
})

// get all students
app.get("/students", async (req, res) => {
  const students = await readFromFile();
    if (!students) {
        res.status(404).json({
            message: "No student found"
        })
    } else {
        res.json({
            data: students,
          });
    }
});

// get a student

app.get('/students/:id',async (req,res)=>{
    const studentId = parseInt(req.params.id)

    const students = await readFromFile()

    const student = students.find((track)=> track.id === studentId)

    if (student) {
        res.status(200).json({
            data: student
        })
    } else {
        res.status(404).json({
            message: `student with id ${studentId} not found`
        })
    }
})

// update a student

app.put("/students/:id", async (req, res)=>{
    const studentId = parseInt(req.params.id)

    const Students = await readFromFile()

    const update = req.body

    for (let i = 0; i < Students.length; i++) {
        if (Students[i].id === studentId) {
            Students[i] = {...Students[i],...update}

        await writeToFile(Students)
            res.status(200).json({
                message: 'updated successfully',
                data: Students
            })
        } 
        
        
    } 
})

// delete a student

app.delete('/students/:id', async (req,res)=>{
    const studentId = parseInt(req.params.id)

    const students = await readFromFile()

   const mainlength = students.length

    const reserved = students.filter((student)=> student.id !== studentId)

    await writeToFile(reserved)

    if (mainlength === reserved.length) {
        res.status(404).json({
            message:`No student with id ${studentId}`
        })
    } else {
        res.status(200).json({
            message: "student deleted successfully",
            data: reserved
        })
    }
})

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});