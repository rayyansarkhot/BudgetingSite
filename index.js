let createButton = document.getElementById('getAllEnvelopes');
let divArray = [];

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
        all = new TextDecoder().decode(done.value)
    });
    
    // Redefined from string to object so properties are more accessibile.
    all = JSON.parse(all);

    // Loop calls function to create envelope spaces with info.
    for(let x = 0; x < all.length; x++ ) {
        createEnvelope(all[x].name, all[x].budget, all[x].used);
    }

    
};

// Creates divs and styles them according to number of envelopes created.
let createEnvelope = (name, budget, used) => {

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


createButton.onclick = getAll;