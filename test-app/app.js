//run npm install at /test-app to install dependencies locally

const express = require('express');
const app = express();
const port = 3000;

const router = express.Router(); 

let students = [
  { id: 1, name: "Juliet", course: "Mathematics" },
  { id: 2, name: "Ruby Rose", course: "Economics" },
  { id: 3, name: "Yang Xiao Long", course: "Philosophy" },
  { id: 4, name: "Weiss Schnee", course: "English Literature" },
  { id: 5, name: "Blake Belladonna", course: "Film Studies" },
  { id: 6, name: "Pyrra Nikos", course: "Mathematics" }
];

// GET requests

router.get('/students', (req, res) => {
  if (req.query.course) {
    filteredStudents = students.filter(person => person.course === req.query.course);

    res.status(200);
    res.json(filteredStudents);

  } else {
    res.status(200);
    res.json(students);
  }
});

router.get('/students/:id', (req, res) => {
  const personId = parseInt(req.params.id);
  student = students.find(person => person.id === personId);
  
  res.status(200)
  res.json(student)
});

// POST requests

router.post('/students', (req, res) => {
  const {id, name, course} = req.body;
  if (!id || !name || !course) {
    return res.status(400).json({ message: "Missing fields: id, name, or course" });
  }

  if (students.find(person => person.id === id)) {
    return res.status(409).json({ message: "Student with that id already exists" });
  }

  students.push({ id, name, course })
  res.status(201).json({ message: "student created successfully", ...req.body })
})

/////////////////

router.get('/', (req, res) => {
  res.status(200)
  res.send('Hello, world!');
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});