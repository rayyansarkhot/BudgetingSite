let createButton = document.getElementById('getAllEnvelopes');
let request = new XMLHttpRequest();

const getAll = async () => {

    let reader;

    await fetch('http://localhost:3000/envelopes/').then(response => {
        // Attached reader to readableStream obj.
        reader = response.body.getReader();
    });


    reader.read().then(function process(done, value) {
        
        let str = new TextDecoder().decode(done.value)
        console.log(str);
        
    }); 

};

createButton.onclick = getAll;