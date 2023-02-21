const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');

const mongoose = require('mongoose');

const mongoUser= "nicomassa";
const mongoPass = "pd4W7kAWS82D5cxL";
const dataBase = "ecommerce";
const mongoDbConfig = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.q77nmf6.mongodb.net/${dataBase}`;

const app = express();
const PORT = 3000;
const httpServer = require('http').createServer(app);
const io = require('socket.io') (httpServer, {cors: {origin:"*"}})


app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

httpServer.listen(PORT, ()=>{
    console.log(`Server listening in port: ${PORT}`);
});

let product = [
    {
        id: 1,
        name: "zapato",
        price: 15000,
        photo: "https://cdn.shopify.com/s/files/1/0517/6282/3347/products/HCAC00969021-01_720x.jpg?v=1640618168"
    },

    {
        id: 2,
        name: "cartera",
        price: 3000,
        photo: "https://juanitajo.com/28715-thickbox_default/cartera-bela-grande.jpg"
    },

    {
        id: 3,
        name: "bolso",
        price: 5000,
        photo: "https://cdn.solodeportes.com.ar/media/catalog/product/cache/3cb7d75bc2a65211451e92c5381048e9/b/o/bolso-topper-tote-benito-mujer-negro-800030172704001-1.jpg"
    }
];

let chat = [
    {
        email:"a@agmail.com",
        date: new Date().toLocaleDateString(),
        message:"hola"
    }
];


let user = [
    {
        user: "nico"
    }
];

// app.get('/products', (req, res) => {
//     res.render('products', { products });
// });
// { root: __dirname + 'public'}

// app.get('/', (req, res) => {
//     res.render('productslist', { root: __dirname + 'public'});
// });

io.on('connection', (socket) => {
    console.log(`New connection id: ${socket.id}`);

    socket.emit('products', product);
    socket.emit('chat', chat);
    socket.emit('user', user);

    socket.on('newMessage', msg => {
        chat.push(msg);
        io.sockets.emit('chat', chat);
    });

    socket.on('newProduct', prod => {
        product.push(prod);
        io.sockets.emit('products', product);
    });

    socket.on('newUser', userName => {
        product.push(userName);
        io.sockets.emit('users', user);
    });
});

console.log(user);

// const cookieParser = require('cookie-parser');

// app.use(cookieParser());

// const cookiesRouter = express.Router();

// cookiesRouter.post('/', (req, res) => {
//     const cookieName = req.body.name;
//     const cookieValue = req.body.value;;
//     const cookieMaxAge = req.body.maxAge;

//     res.cookie(cookieName, cookieValue, { MaxAge }).send('OK');
// });

// app.use('/coockies', cookiesRouter);


app.use(session({
    store: mongoStore.create({mongoUrl: mongoDbConfig}),
    cookie: {
        maxAge: 60000,
    },
    secret: 'my-super-secret',
    resave: true,
    saveUninitialized: true, 
}));

app.get('/login', (req, res) => {
    
    const userName = req.body;
    user.push(userName);

    let loginToRender =`<h2>Login de Usuario</h2>
        <form action="/" method="POST">
            <div class="mb-3">
                <label for="name" class="form-label">Ingrese su Nombre: </label>
                <input type="text" class="form-control" id="userInput" name="userInput" aria-describedby="name">
                <button type="submit" id="btnUser" class="btn btn-primary">enviar</button>
        </form>`

        res.send(loginToRender);
});

app.post('/post', (req, res) => {
    
    const userName = req.body.userInput;
    user.push(userName);

});
// productsRouter.post('/', (req, res) => {
//     const newID = products.length + 1;
    
//     const productToAdd = req.body;
//     const newProduct = {'id':newID, ...productToAdd};
//     products.push(newProduct);

//     res.status(200).json({ products });
// });

app.get('/', (req, res) => {

    user = req.body;
    console.log(user);
    if (user == 'nico') {
        res.redirect('/');
    } else {
        res.send(`El usuario ${user}, no existe`);
    }
});


app.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('Something terrible just happened!!!');
        } else {
            res.send(`Hasta Luego ${user}`);
        }
    }) 
});

// app.get('/', (req, res) => {


//     if (typeof req.session.count !== 'number') {
//         req.session.name = req.query.name ?? '';
//         req.session.count = 1;
//         res.send(`Hola ${req.session.name}, te damos la bienvenida`);
//     } else {
//         req.session.count ++;
//         res.send(`Hola ${req.session.name}, has visitado esta pagina ${req.session.count} veces`);
//     }
// });