const assert = require('chai').assert;
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');

describe('vl-util build', () => {
  before(async () => {
    await new Promise((resolve) => exec(`node ${path.resolve(__dirname, '../')}/build ${__dirname}/single/example example no-commit`, () => resolve()));
    await new Promise((resolve) => exec(`node ${path.resolve(__dirname, '../')}/build ${__dirname}/multiple/exampleexample no-commit`, () => resolve()));
  });

  const assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder = (distFolder, expectedFolder) => {
    fs.readdir(expectedFolder, function(err, expectedFiles) {
      fs.readdir(distFolder, function(err, files) {
        assert.equal(expectedFiles.length, files.length, 'Niet hetzelfde aantal files in expected dir en dist dir');
        files.forEach((file) => {
          const distFile = fs.readFileSync(distFolder + file, 'utf8');
          const expectedFile = fs.readFileSync(expectedFolder + file, 'utf8');
          assert.equal(distFile, expectedFile, file + ' komt niet overeen!');
        });
      });
    });
  };

  describe('single', function() {
    const distFolderSingle = __dirname + '/single/example/dist/';
    const expectedFolderSingle = __dirname + '/single/expected/';

    it('de inhoud van de gebuilde dist folder komt overeen met de inhoud van de verwachte folder', function() {
      assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder(distFolderSingle, expectedFolderSingle);
    });
  });

  describe('multiple', function() {
    const distFolderMultiple = __dirname + '/multiple/example/dist/';
    const expectedFolderMultiple = __dirname + '/multiple/expected/';

    it('de inhoud van de gebuilde dist folder komt overeen met de inhoud van de verwachte folder', function() {
      assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder(distFolderMultiple, expectedFolderMultiple);
    });
  });
});
