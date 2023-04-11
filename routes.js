const express = require('express');
const app = express();
var cors = require('cors');
const PORT = 3000;

// Object array holds individual budget names.
let envelopes = [
    {
        name: 'food',
        budget: 100,
        used: 0,
    }
];

app.use(cors());

// Get endpoint sends all envelopes back.
app.get('/envelopes', (req, res, next) => {
    res.status(200).send(envelopes);
});

// Get endpoint to receive a specific envelope.
app.get('/envelopes/:name', (req,res,next) => {
   
    // Flag indicates whether envelope exists in array.
    let index = -1;
    
    // Loops through envelopes array to check if envelope exists.
    for(let i = 0; i < envelopes.length; i++) {
        if(envelopes[i].name === req.params.name.toLowerCase()){ 
            index = i;
        }
    }

    // Checks if envelope does not exists.
    if(index === -1) {
        res.status(400).send('ENVELOPE DOES NOT EXIST');
    } else {
        // Sends specific envelope back.
        res.status(200).send(envelopes[index]);   
    }

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

// Put endpoint to call to update an envelope.
app.put('/envelopes/update/:name', (req,res,next) => {
        
    // Flag indicates whether envelope exists in array.
    let index = -1;
    
    // Loops through envelopes array to check if envelope exists.
    for(let i = 0; i < envelopes.length; i++) {
        if(envelopes[i].name === req.params.name.toLowerCase()){ 
            index = i;
        }
    }

    // Checks if envelope does not exists.
    if(index === -1) {
        res.status(400).send('ENVELOPE DOES NOT EXIST');
    } else {

        // If statement checks if user's used query is a valid value.
        if(Number(req.query.used)) {
            envelopes[index].used += Number(req.query.used);// Increases used value.   
        } 
        // This fires if the user entered an invalid number. Not if it hasn't been entered.
        else if(req.query.used !== undefined) {
            res.status(400).send('USED VALUE IS NOT A NUMBER');
        }

        // If statement checks if user's budget query is a valid value.
        if(Number(req.query.budget)) {
            envelopes[index].budget = Number(req.query.budget);// Sets budget.    
        } 
        // This fires if the user entered an invalid number. Not if it hasn't been entered.
        else if(req.query.budget !== undefined) {
            res.status(400).send('BUDGET VALUE IS NOT A NUMBER');
        }

        // If statement checks if user sent in a value for renaming.
        if(req.query.nombre !== undefined) {
            envelopes[index].name = req.query.nombre// Sets name.    
        }
        
        // Responds to client with remaining balance.
        res.status(200).send('ENVELOPE SUCCESSFULLY UPDATED.');         
        
        }

});

// Delete endpoint deletes one specific envelope.
app.delete('/envelopes/delete/:name', (req,res,next) => {

    // Flag indicates whether envelope exists in array.
    let index = -1;
    
    // Loops through envelopes array to check if envelope exists.
    for(let i = 0; i < envelopes.length; i++) {
        if(envelopes[i].name === req.params.name.toLowerCase()){ 
            index = i;
        }
    }

    // Checks if envelope does not exists.
    if(index === -1) {
        res.status(400).send('ENVELOPE DOES NOT EXIST');
    } else {
        // Removes envelope from the array.
        envelopes.splice(index, 1);
        res.status(200).send('SUCCESSFULLY DELETED AN ENVELOPE.');   
    }
    
});

// Put endpoint takes one envelope's budget and allocates to another.
app.put('/envelopes/transfer/:from/:to', (req,res,next) => {

    // Flag indicates whether envelope exists in array.
    let indexFrom = -1;
    let indexTo = -1;

    // Loops through envelopes array to check if envelope exists.
    for(let i = 0; i < envelopes.length; i++) {
        
        // Checks if from paramater exists in array.
        if(envelopes[i].name === req.params.from.toLowerCase())
            indexFrom = i;
        // Checks if to paramater exists in array.
        if(envelopes[i].name === req.params.to.toLowerCase())
            indexTo = i;
        
    }

    // Checks if envelope does not exists.
    if(indexFrom === -1 || indexTo === -1) {
        res.status(400).send('ENVELOPE DOES NOT EXIST');
    } else {

        // If statement checks if amount trying to transfer from former envelope is available.  
        if(envelopes[indexFrom].budget < Number(req.query.amount)) {
            res.status(400).send("TRANSFER AMOUNT EXCEEDS BUDGET.");
        } else {

            // Transfer budget from one envelope to other.
            envelopes[indexTo].budget += Number(req.query.amount);
            envelopes[indexFrom].budget -= Number(req.query.amount);

            res.status(200).send('SUCCESSFULLY TRANSFERED FUNDS.');

        }
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))