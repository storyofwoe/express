const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

const blogs = [
  { id: 1, title: "Intro to Node.js", content: "Node.js is a Javascript runtime built on Chrome's V8 engine..." },
  { id: 2, title: "Routing in Express", content: "Routing in Express helps you define endpoints for your app..." },
  { id: 3, title: "Middleware Explained", content: "Middleware functions have access to req, res, and next..." }
];

const user = [
  { id: 1, username: "r.rose", hash: 10 }
]

const stringHashFunc = (input) => {
  if (!input) { return null };
  let sum = 0;

  let letterVal = input.charCodeAt(0);
  if (letterVal - 96 < 0) { //if the letter is a capital
    sum = letterVal - 64 + 26;//Make captials start at 27

  } else { //if the letter is lowercase
    sum = letterVal - 96
  }

  return sum;
}

const hashFunc = (word) => {
  if (!word) { return null };

  const wordLen = word.length; 
  let sum = 0;

  for (let i = 0; i < wordLen; i++) {
    let letter = word[i];
    if (isNaN(letter)) {
      sum += stringHashFunc(letter);
    } else {
      sum += parseInt(letter)
    }
  }

  return sum % 53;
}

//-----------------
//ENDPOINTS
//-----------------

app.head('/', (req, res) => { //healthcheck
  return res.status(200).end();
})

app.get('/message', (req, res) => {
  res.send(`<h1>Welcome!</h1>`)
})

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`)
  next();
})

app.post('/login', (req, res) => {
  const givenUsername = req.body.username;
  const givenHash = hashFunc(req.body.password);

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
  const givenId = user.at(-1).id + 1; //add 1 to the last user, thus users don't need to supply ids as part of their POST req
  const givenUsername = req.body.username;
  const givenHash = hashFunc(req.body.password);

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

app.delete('/delete', (req, res) => {
  const givenUsername = req.body.username;
  const givenHash = hashFunc(req.body.password);

  if (!givenUsername || !givenHash) {
    return res.status(400).json({ message: 'Missing fields: username or password' })
  }

  const dbDetails = user.find(u => u.username === givenUsername)

  if (dbDetails) { //.find() already verifies the username is correct, this is to check if it's not null
    const dbUser = dbDetails.username;
    const dbHash = dbDetails.hash;
    if (givenHash === dbHash) {
      const dbIndex = user.indexOf(dbDetails);
      user.splice(dbIndex, 1)
      console.log(user); //debugging
      return res.status(200).json({ message: 'User successfully deleted', user: dbUser });

    } else { //if password is wrong
      return res.status(401).json({ message: 'Error: username or password incorrect' })
    }

  } else { //if username is null
    return res.status(401).json({ message: 'Error: username or password incorrect' })
  }
})


// The following endpoints existed before alphanumeric passwords were supported.

// app.post('/signup-string', (req, res) => {
//   const givenId = req.body.id;
//   const givenUsername = req.body.username;
//   const givenHash = stringHashFunc(req.body.password);

//   //not including validating because this is an early test and POC

//   user.push({ id: givenId, username: givenUsername, hash: givenHash })
//   // console.log(user);
//   res.status(201).json({ message: 'user created successfully', user: givenUsername })
// })

// app.post('/login-string', (req, res) => {
//   const givenUsername = req.body.username;
//   const givenHash = stringHashFunc(req.body.password);

//   const dbDetails = user.find(u => u.username === givenUsername)
//   const dbUser = dbDetails.username;
//   const dbHash = dbDetails.hash;

//   if (dbHash === givenHash) {
//       return res.status(200).json({ message: 'Successfully logged in as', user: dbUser })

//   } else {
//       return res.status(401).json({ message: 'Error: username or password incorrect' })
//   }
// })

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