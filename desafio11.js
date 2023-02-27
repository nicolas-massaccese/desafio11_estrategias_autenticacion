const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/auth');
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

app.use(session({
    store: mongoStore.create({mongoUrl: mongoDbConfig}),
    cookie: {
        maxAge: 60000,
    }, 
    secret: 'my-super-secret',
    resave: true,
    saveUninitialized: true, 
}));
app.use(passport.initialize());
app.use(passport.session());

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


let users  = [
    {
        username: "nico",
        password: "123",

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




app.post('/signup', passport.authenticate('signup', { failureRedirect: '/login.html' }), (req, res) => {
    
    req.session.username = req.user.username;
    res.redirect('/datos');
});

app.post('/login', passport.authenticate('login', { failureRedirect: '/login.html' }), (req, res) => {

    req.session.username = req.user.username;
    res.redirect('/datos');

});


app.get('/datos', (req, res) => {

    if(req.session.username) {

        res.send(`Bienvenido ${req.session.username}`)
        // res.json(req.session.name);
    } else {
        res.redirect('/login.html'); 
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.status(500).send('Failed to logout');
        } else {
            res.redirect('/login.html'); 
        }
    });
});
