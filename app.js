'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = {};

/**
 * takes a file and makes it's contents uppercase then resaves it
 * @param {*} filepath
 */
const alterFile = async (filepath) => {
  const file = await getFile(filepath)
  let fileContent = upperCaseFile(file);
  await saveFile(filepath, fileContent)
}

/**
 * make file content upper case
 * @param {*} filepath
 * @returns {*} the contents of the file as a string
 */
const getFile = async (filepath) => {
  return readFile(filepath)
    .then(data => {
      const content = data.toString()
      return content;
    })
    .catch(error => {
      socket.emit('file-error', error);
    })
}

/**
 * make file content upper case
 * @param {*} fileContent
 * @returns {*} the contents of the file upper cased
 */
const upperCaseFile = (fileContent) => {
  const content = fileContent.toUpperCase();
  return content;
}

/**
 * make file content lower case
 * @param {*} fileContent
 * @returns {*} the contents of the file lower cased
 */
const lowerCaseFile = (fileContent) => {
  const content = fileContent.toLowerCase();
  return content;
}

/**
 * saves fileContect to filePath location
 * @param {*} filepath
 * @param {*} fileContent
 */
const saveFile = async (filepath, fileContent) => {
  return writeFile(filepath, Buffer.from(fileContent))
    .then(() => {
      socket.emit('file-save', 'File has been saved');
    })
    .catch(error => {
      socket.emit('file-error', error);
    })
}

let testFilePath = './files/test.txt'
alterFile(testFilePath);

module.exports = { saveFile, lowerCaseFile, upperCaseFile, getFile, alterFile };