const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`)
  next();
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