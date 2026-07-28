const express = require('express');
const app = express();
const port = 3000;

const blogs = [
  { id: 1, title: "Intro to Node.js", content: "Node.js is a Javascript runtime built on Chrome's V8 engine..." },
  { id: 2, title: "Routing in Express", content: "Routing in Express helps you define endpoints for your app..." },
  { id: 3, title: "Middleware Explained", content: "Middleware functions have access to req, res, and next..." }
];

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`)
  next();
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