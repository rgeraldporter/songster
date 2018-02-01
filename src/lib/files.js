const fsx = require('fs-extra');
const path = require('path');

const isFile = item => fsx.lstatSync(item).isFile();
const isDirectory = item => fsx.lstatSync(item).isDirectory();
const randomFile = arr => arr[Math.floor(Math.random() * arr.length)];

const getDirectories = () =>
    fsx
        .readdirSync(__dirname + '/../../songs/')
        .map(name => path.join(__dirname + '/../../songs/', name))
        .filter(isDirectory)
        .map(path => path.split('\\').pop().split('/').pop());

const getFiles = dir =>
    fsx
        .readdirSync(__dirname + '/../../songs/' + dir)
        .map(name => path.join(__dirname + '/../../songs/' + dir, name))
        .filter(isFile)
        .map(path => path.split('\\').pop().split('/').pop());

const getRandomFile = dir => getFiles(dir).then(randomFile);

module.exports = { getDirectories, getFiles };
