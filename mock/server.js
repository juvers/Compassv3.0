const path = require('path');
// var express = require('express');
const btoa = require('btoa');
console.log(__dirname);
const jsonServer = require('json-server');
const demodata = require(path.join(__dirname, 'db.json'));
const routes = require(path.join(__dirname, 'routes.json'));
const middlewares = jsonServer.defaults();

const router = jsonServer.router(demodata); // Express router
const server = jsonServer.create(); // Express server
router.db._.id = '_id';
server.use(middlewares);
// server.use('/static', express.static(path.join(__dirname, 'public')))

// Avoid CORS issue
// server.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// server.post('/logout', (req, res) => {
//     res.send('OK');
// });
// server.post('/auth/login', (req, res) => {
//     console.log(`${req} ---- ${res}`);
//     res.json(require(path.join(__dirname, 'mocks', 'login.json')));
// });

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    console.log(`${req.method} ---- ${req.url}`);
    if (req.method === 'POST' && req.url.endsWith('/auth/login')) {
        const data = btoa(
            JSON.stringify({
                _id: 1,
                isAdmin: 2,
                participantName: 'Test Tester',
                programWave: 2
            })
        );
        res.json({ token: `sdfsdfsf.${data}.sdfsdfsdf` });
        // res.json(require(path.join(__dirname, mocks, 'login.json')));
    } else if (req.method === 'POST' && req.url.endsWith('/auth/logout')) {
        res.send('OK');
    } else {
        // Continue to JSON Server router
        next();
    }
});
console.log(routes);

console.log(JSON.stringify(routes));
server.use(jsonServer.rewriter(routes));
server.use(router);

server.listen(4333);
