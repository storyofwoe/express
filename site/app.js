const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

const blogs = [
  { id: 1, title: "Intro to Node.js", content: "Node.js is a Javascript runtime built on Chrome's V8 engine..." },
  { id: 2, title: "Routing in Express", content: "Routing in Express helps you define endpoints for your app..." },
  { id: 3, title: "Middleware Explained", content: "Middleware functions have access to req, res, and next..." }
];

const user = [
  { id: 1, username: "r.rose", hash: 10 }
]

const sumDigits = (input) => {
  let sum = 0;

  while (input) {
    sum += input % 10;
    input = Math.floor(input / 10);
  };

  return sum;
}

const hashFunc = (input) => {
  if (!input) {
    return null
  }

  const inputInt = parseInt(input)
  return sumDigits(inputInt);
}

//-----------------
//ENDPOINTS
//-----------------

app.head('/', (req, res) => { //healthcheck
  return res.status(200).end();
})

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`)
  next();
})

app.post('/login', (req, res) => {
  const givenUsername = req.body.username;
  const givenHash = hashFunc(parseInt(req.body.password));

  if (!givenUsername || !givenHash) {
    return res.status(400).json({ message: 'Missing fields: name or password' })
  }

  const dbDetails = user.find(u => u.username === givenUsername)

  if (dbDetails) { //.find() already verifies the username is correct, this is to check if it's not null
    const dbUser = dbDetails.username;
    const dbHash = dbDetails.hash;
    if (givenHash === dbHash) {
      return res.status(200).json({ message: 'Successfully logged in as', user: dbUser })

    } else { //if password is wrong
      return res.status(401).json({ message: 'Error: username or password incorrect' })
    }

  } else { //if username is null
    return res.status(401).json({ message: 'Error: username or password incorrect' })
  }
})

app.post('/signup', (req, res) => {
  const givenId = req.body.id;
  const givenUsername = req.body.username;
  const givenHash = hashFunc(parseInt(req.body.password));

  if (!givenId || !givenUsername || !givenHash) {
    return res.status(400).json({ message: 'Missing fields: id, username, or password' })
  }

  if (user.find(person => person.id === givenId)) { //check for conflicting ids
    return res.status(409).json({ message: "User with that id already exists" });
  }

  if (user.find(person => person.username === givenUsername)) { //check for conflicting usernames
    return res.status(409).json({ message: "User with that username already exists" });
  }

  user.push({ id: givenId, username: givenUsername, hash: givenHash }) //never store password as plaintext
  res.status(201).json({ message: 'user created successfully', user: givenUsername })
})

//------------------
//BLOGS
//------------------

app.get('/blogs', (req, res) => {
  const titles = blogs.map(blogs => blogs.title);

  const result = blogs.map( ({ id, title }) => ({ id, title }) ); //return just id and title (not content)

  res.json(result)
});

app.get('/blogs/:id', (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogs.find(b => b.id === blogId);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ message: 'Blog not found' })
  }
})

app.get('/about', (req, res) => {
    res.send(`
        <h1>About Zenith, Ltd.</h1>
        <p>Lorem ipsom dolor sit amet</p>
    `.trim())
})

//-------------------
// LISTENING
//-------------------

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});