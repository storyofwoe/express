//run npm install at /test-app to install dependencies locally

const express = require('express');
const app = express();
const port = 3000;

let students = [
  { id: 1, name: "Juliet", course: "Mathematics" },
  { id: 2, name: "Ruby Rose", course: "Economics" },
  { id: 3, name: "Yang Xiao Long", course: "Philosophy" },
  { id: 4, name: "Weiss Schnee", course: "English Literature" },
  { id: 5, name: "Blake Belladonna", course: "Film Studies" },
  { id: 6, name: "Pyrra Nikos", course: "Mathematics" }
];

app.get('/students', (req, res) => {
  if (req.query.course) {
    filteredStudents = students.filter(person => person.course === req.query.course);

    res.status(200);
    res.json(filteredStudents);

  } else {
    res.status(200);
    res.json(students);
  }
});

app.get('/students/:id', (req, res) => {
  const personId = parseInt(req.params.id);
  student = students.find(person => person.id === personId);
  
  res.status(200)
  res.json(student)
});

//////////////////

app.get('/', (req, res) => {
  res.status(200)
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});