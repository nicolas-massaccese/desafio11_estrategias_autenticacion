const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');


passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    const user = users.find(user => user.username === username);
    done(null, user);
});

passport.use('login', new LocalStrategy((username, password, done) => {
    const user = users.find(user => user.username === username && user.password === password);

    if(user) {
        done(null, user);
        return;
    }
    done(null, user);
}));

passport.use('signup', new LocalStrategy((username, password, done) => {
    const existentUser = users.find(user => user.username === username);

    if(existentUser) {
        done(new Error('El usuario ya existe'));
        return;
    }
    const user = { username, password };
    users.push(null, user);
    done();
}));