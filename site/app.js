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
  { id: 1, username: "r.rose", password: "1234" }
]

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`)
  next();
})

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields: name or password' })
  }

  //const result = blogs.map( ({ username, password }) => ({ username, password }) );

  const userLogin = user.find(u => u.username === username)
  if (userLogin) {
    if (userLogin.password === password) {
      return res.status(200).json({ message: 'Successfully logged in as', user: userLogin.username })
    } else {
      return res.status(401).json({ message: 'Error: username or password incorrect' })
    }

  } else {
    return res.status(401).json({ message: 'Error: username or password incorrect' })
  }
})

app.post('/signup', (req, res) => {
  const { id, username, password } = req.body;

  if (!id || !username || !password) {
    return res.status(400).json({ message: 'Missing fields: id, username, or password' })
  }

  if (user.find(person => person.id === id)) {
    return res.status(409).json({ message: "User with that id already exists" });
  }

  if (user.find(person => person.username === username)) {
    return res.status(409).json({ message: "User with that username already exists" });
  }

  user.push({ id, username, password })
  res.status(201).json({ message: 'user created successfully', ...req.body })
})

app.get('/blogs', (req, res) => {
  const titles = blogs.map(blogs => blogs.title);

  const result = blogs.map( ({ id, title }) => ({ id, title }) );

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});