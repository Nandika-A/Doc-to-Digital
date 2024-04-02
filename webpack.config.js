const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './assets/scripts/maintest.js',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, './', 'static/js')
    },
    resolve: {
        alias: {
            'babylonjs-loaders': 'babylonjs-loaders/babylonjs.loaders.min.js',
        },
    }
    
}