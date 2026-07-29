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

  // const dbUser = user.find(u => u.username === givenUsername)
  // const dbHash = hashFunc(parseInt(userLogin.password))

  // const dbDetails = user.map( ({ username, hash }) => ({ username, hash }) );

  // console.log(dbDetails);

  //we need to compare given username against the db to check if account even exists
  //then we need to put the given password through the hash algorithm and compare with db to check if password is correct

  if (userLogin) {
    if (userHash === hash) {
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

//------------------
//BLOGS
//------------------

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