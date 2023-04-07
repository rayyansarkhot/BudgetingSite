const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))