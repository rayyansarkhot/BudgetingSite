let createButton = document.getElementById('getAllEnvelopes');
let createForm = document.getElementById('createForm');
let getForm = document.getElementById('getForm');
let updateForm = document.getElementById('updateForm');
let deleteForm = document.getElementById('deleteForm');
let transferForm = document.getElementById('transferForm');
let divArray = [];

// Creates divs and styles them according to number of envelopes created.
let createEnvelopeBox = (name, budget, used) => {

    // Creates a new div and adds it to html DOM.
    const newDiv = document.createElement("div");    
    document.getElementById('envelopes').append(newDiv);

    // Stylizes the div.
    newDiv.style.backgroundColor = 'white';
    newDiv.style.border = '1px solid blue';
    newDiv.style.borderRadius = '1px';
    newDiv.style.width = "10%";
    newDiv.style.height = "10%";
    newDiv.style.fontSize = "80%";
    newDiv.style.padding = '5%';
    newDiv.style.margin = 'auto';
    newDiv.innerHTML = `name: ${name} <br>budget: ${budget} <br>used: ${used}`;

    divArray.push(newDiv);

};

// Deletes divs on screen so new option can appear.
let deleteDivs = () => {
    
    for(let x = 0; x < divArray.length; x++) {

        divArray[x].remove();

    }

    divArray = [];

};

// Function is responsible for getting all envelopes.
const getAll = async () => {

    let reader;
    let all;

    deleteDivs();// Removes before created divs from page.

    // Sends an API request to get all envelopes.
    await fetch('http://localhost:3000/envelopes/').then(response => {
        // Attached reader to readableStream obj.
        reader = response.body.getReader();
    });

    // Reader reads from readableStream object.
    await reader.read().then(function process(done, value) {
        // Decodes array and places it into a variable.
        all = new TextDecoder().decode(done.value);
    });
    
    // Redefined from string to object so properties are more accessibile.
    all = JSON.parse(all);

    if(all.length === 0) {
        alert('NO ENVELOPES AVAILABLE.')
    } else {
        // Loop calls function to create envelope spaces with info.
        for(let x = 0; x < all.length; x++ ) {
            createEnvelopeBox(all[x].name, all[x].budget, all[x].used);
        }
    }
    
};

// Function takes data from form and sends it to api.
let createEnvelope = async (e) => {
    
    // Takes input entered from form.
    let name = document.getElementById('name').value;
    let budget = document.getElementById('budget').value;
    let used = document.getElementById('used').value;

    // Checks if any field were left empty.
    if (name === "" || used === "" || budget === "" ) {
        alert("Ensure you input a value in all fields!");
    } else {

        deleteDivs();// Removes before created divs from page.
        e.preventDefault();

        // Sends an API request to create an envelopes.
        await fetch(`http://localhost:3000/envelopes/add?name=${name}&budget=${budget}&used=${used}`,
        { 
            method: 'POST', 
            mode: "cors"
        })
        .then(response => {
            alert(`Successfully created new envelope:\nname: ${name}\nbudget: ${budget}\nused: ${used}`);
        });
        
    }

};

// Function takes data from form and sends it to api to display a specific envelope.
let getSpecificEnvelope = async (e) => {
    
    let reader;
    let all;

    // Takes input entered from form.
    let nombre = document.getElementById('specificEnvelope').value;

    // Checks if any field were left empty.
    if (nombre === "") {
        alert("Ensure you input a value!");
    } else {

        deleteDivs();// Removes before created divs from page.
        e.preventDefault();
        let responseStatus;// Holds http status code of below fetch.

        // Sends an API request to get an envelope.
        await fetch(`http://localhost:3000/envelopes/${nombre}`).then(response => {
            // Attached reader to readableStream obj.
            reader = response.body.getReader();
            responseStatus = response.status;
            
        });
        // Reader reads from readableStream object.
        await reader.read().then(function process(done, value) {

            // Decodes array and places it into a variable.
            all = new TextDecoder().decode(done.value);

            // Checks if proper status code was recieved.
            if(responseStatus === 200) {

                // Redefined from string to object so properties are more accessibile.
                all = JSON.parse(all);

                // Calls function to create envelope spaces with info.
                createEnvelopeBox(all.name, all.budget, all.used);

            } else {
                // Throws errow to be caught by catch statement below.
                throw new Error(all);
            }

        }).catch((errorResponse) => {
        
            // Displays error message.
            alert(errorResponse.message);
        
        });

        
    }

};

// Function updates a specific envelope's data.
let updateEnvelope = async (e) => {

    // Takes input entered from form.
    let name = document.getElementById('updateName').value;
    let budget = document.getElementById('updateBudget').value;
    let used = document.getElementById('updateUsed').value;

    // Checks if any field were left empty.
    if (name === "" || ( used === "" && budget === "" )) {
        alert("Ensure you input a value in the name and another field!");
    } else {

        deleteDivs();// Removes before created divs from page.
        e.preventDefault();

        // Sends an API request to update an envelope.
        await fetch(`http://localhost:3000/envelopes/update/${name}?budget=${budget}&used=${used}`,
        { 
            method: 'PUT', 
            mode: "cors"
        })
        .then(response => {

            // Throws error or success response depending on response status code.
            if(response.status === 200) {
                alert(`Successfully update envelope.`);
            } else {
                throw new Error(response.statusText);
            }
            
        }).catch((errorResponse) => {
            // Prints error message.
            alert(errorResponse.message);
        }) ;
        
    }

};

// Function deletes a specific envelope.
let deleteEnvelope = async (e) => {

    let reader;
    let all;

    // Takes input entered from form.
    let nombre = document.getElementById('deleteEnvelope').value;

    // Checks if any field were left empty.
    if (nombre === "") {
        alert("Ensure you input a value!");
    } else {

        deleteDivs();// Removes before created divs from page.
        e.preventDefault();
        let responseStatus;// Holds http status code of below fetch.

        // Sends an API request to delete an envelope.
        await fetch(`http://localhost:3000/envelopes/delete/${nombre}`,
        { 
            method: 'DELETE', 
            mode: "cors"
        }).then(response => {
            // Attached reader to readableStream obj.
            reader = response.body.getReader();
            responseStatus = response.status;
            
        });
        // Reader reads from readableStream object.
        await reader.read().then(function process(done, value) {

            // Decodes array and places it into a variable.
            all = new TextDecoder().decode(done.value);

            // Checks if proper status code was recieved.
            if(responseStatus === 200) {
                alert('Successfully deleted envelope.')
            } else {
                // Throws errow to be caught by catch statement below.
                throw new Error(all);
            }

        }).catch((errorResponse) => {
        
            // Displays error message.
            alert(errorResponse.message);
        
        });
    }
};

// Function transfer budget from one envelope to another.
let transferEnvelope = async(e) => {

    let reader;
    let all;

    // Takes input entered from form.
    let fromEnvelope = document.getElementById('fromEnvelope').value;
    let toEnvelope = document.getElementById('toEnvelope').value;
    let transferAmount = document.getElementById('transferAmount').value;

    // Checks if any fields were left empty.
    if (fromEnvelope === "" || transferAmount === "" || toEnvelope === "") {
        alert("Ensure you input a value in all fields!");
    } 
    // Else if fires if client entered a non-number.
    else if (!Number(transferAmount)) {
        alert('Enter a valid number in transfer amount field.')
    } 
    else {

        deleteDivs();// Removes before created divs from page.
        e.preventDefault();
        let responseStatus;// Holds http status code of below fetch.

        // Sends an API request to transfer envelope funds.
        await fetch(`http://localhost:3000/envelopes/transfer/${fromEnvelope}/${toEnvelope}?amount=${transferAmount}`,
        { 
            method: 'PUT', 
            mode: "cors"
        }).then(response => {
            // Attached reader to readableStream obj.
            reader = response.body.getReader();
            responseStatus = response.status;
        });

        // Reader reads from readableStream object.
        await reader.read().then(function process(done, value) {

            // Decodes array and places it into a variable.
            all = new TextDecoder().decode(done.value);

            // Checks if proper status code was recieved.
            if(responseStatus === 200) {
                alert('SUCCESSFULLY TRANSFERED FUNDS.')
            } else {
                // Throws errow to be caught by catch statement below.
                throw new Error(all);
            }

        }).catch((errorResponse) => {
        
            // Displays error message.
            alert(errorResponse.message);
        
        });

    }

};

createButton.onclick = getAll;
createForm.addEventListener('submit', createEnvelope);
getForm.addEventListener('submit', getSpecificEnvelope);
updateForm.addEventListener('submit', updateEnvelope);
deleteForm.addEventListener('submit', deleteEnvelope);
transferForm.addEventListener('submit', transferEnvelope);