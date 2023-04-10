const express = require('express');
const app = express();
const PORT = 3000;

// Object array holds individual budget names.
let envelopes = [
    {
        name: 'food',
        budget: 100,
        used: 0,
    }
];

// Get endpoint sends all envelopes back.
app.get('/envelopes', (req, res, next) => {
    res.status(200).send(envelopes);
});

// Post endpoint to add an envelope.
app.post('/envelopes/add', (req,res,next) => {
    
    // Flag indicates whether budget name is valid.
    let flag = false;
    
    // Loops through envelopes array to check if budget name is present.
    for(let i = 0; i < envelopes.length; i++) {
        if(envelopes[i].name === req.query.name.toLowerCase()){ 
            flag = true;
        }
    }

    // Checks if budget name already exists.
    if(flag) {
        res.send('ENVELOPE ALREADY EXISTS');
    } 
    // Checks if budget number is a number.
    else if(isNaN(req.query.budget)) {
        res.status(400).send('BUDGET IS NOT A NUMBER.')
    }
    // Checks if used up number is a number.
    else if(isNaN(req.query.used)) {
        res.status(400).send('USED UP IS NOT A NUMBER.')
    }
    // If it does not exist, then it proceeds to add to envelopes array.
    else {


        // Converts string numbers to numbers.
        req.query.budget = Number(req.query.budget);
        req.query.used = Number(req.query.used)
        envelopes.push(req.query);// Pushes to array.
        // Sends success status code.
        res.status(201).send(envelopes[envelopes.length-1]);

    }

});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))