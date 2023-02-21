const btnPrd = document.querySelector("#btnPrd");
btnPrd.addEventListener("click", addProduct);

const btnMsg = document.querySelector("#btnMsg");
btnMsg.addEventListener("click", addMessage);

const btnUser = document.querySelector("#btnUser");
btnPrd.addEventListener("click", addProduct);

function addMessage(e){
    e.preventDefault();

    let messageToAdd = {
        email: `${document.getElementById('emailInput').value}`,
        message: `${document.getElementById('msgInput').value}`,
        date: new Date().toLocaleDateString()
    };

    socket.emit('newMessage', messageToAdd);
};

function addProduct(e){
    e.preventDefault();

    let productToAdd = {
        name: `${document.getElementById('nameInput').value}`,
        price: `${document.getElementById('priceInput').value}`,
        photo: `${document.getElementById('photoInput').value}`
    };

    socket.emit('newProduct', productToAdd);
};

function addUser(e){
    e.preventDefault();

    let userToAdd = `Bienvenido: ${document.getElementById('userInput').value}`;

    socket.emit('newUser', userToAdd);
};

// ---------------------------------- OLD VERSION

const socket = io();

socket.on('connect', () => {
    console.log(socket.id);
});



socket.on('products', (data) => {

    let htmlToRender = `
    <thead class="thead-dark">
        <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">price</th>
            <th scope="col">photo</th>
        </tr>
    </thead>`;
    
    for (let i = 0; i < data.length; i++) {
        htmlToRender +=`
        <tr>
            <td scope="row">${data[i].id}</td>
            <td>${data[i].name}</td>
            <td>${data[i].price}</td>
            <td><img height="60p" src="${data[i].photo}" alt="${data[i].name}"></td>
        </tr>
        `
    };
    document.getElementById('prdList').innerHTML = htmlToRender;
});

socket.on('chat', (data) => {
console.log(data);
    let htmlToRender = '';
    for (let i = 0; i <data.length; i++) {
        htmlToRender +=`
        <tr>
            <td><p style="color:blue; font-weight: bold;">${data[i].email}</p></td>
            <td><p style="color:rgb(65, 33, 1);">${data[i].date}</p></td>
            <td><p style="color:green; font-style: italic;">${data[i].message}</p></td>
        </tr>
        `    
    };
    document.getElementById('msgList').innerHTML = htmlToRender;
});

socket.on('user', (data) => {

    let htmlToRender = `
        <h2>
            <p style="color:blue; font-weight: bold;">${data.user}</p>
        </h2>
        `    
    document.getElementById('Bienvenida').innerHTML = htmlToRender;
});




// ------ PARA CARGAR SOLO EL ULTIMO MENSAJE - ** NO ESTA EN USO ***
socket.on('new-chat', (data) => {

    let htmlExistente = document.getElementById('msgList').innerHTML;
    
        htmlExistente +=`
        <tr>
            <td><p style="color:blue; font-weight: bold;">${data[i].email}</p></td>
            <td><p style="color:rgb(65, 33, 1);">${data[i].date}</p></td>
            <td><p style="color:green; font-style: italic;">${data[i].message}</p></td>
        </tr>
        `;
    

    document.getElementById('msgList').innerHTML = htmlToRender;
});




