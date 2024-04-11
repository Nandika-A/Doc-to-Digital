const path = require('path');

module.exports = {
    entry: './assets/scripts/maintest.js',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, './', 'pirate/static/js')
    },
    resolve: {
        alias: {
            'babylonjs-loaders': 'babylonjs-loaders/babylonjs.loaders.min.js',
        },
    }
    
}