const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = 4420;

const { routes } = require('./config.json');

const app = express();

for (route of routes) {
    app.use(route.route,
        createProxyMiddleware({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/'); // Could use replace, but take care of the leading '/'
            }
        })
    );
}

app.get('/', (req, res) => {
    res.send('<h1>currently in development</h1>');
});

app.listen(PORT, () => {
    console.log('Proxy listening on port 4420');
});