const assert = require('chai').assert;
const fs = require('fs');

describe('vl-util build', function() {

  const assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder = (distFolder, expectedFolder) => {
	fs.readdir(expectedFolder, function(err, expectedFiles){
		fs.readdir(distFolder, function (err, files) {
			assert.equal(expectedFiles.length, files.length, "Niet hetzelfde aantal files in expected dir en dist dir");
			files.forEach((file) => {
				const distFile = fs.readFileSync(distFolder + file, 'utf8');
				const expectedFile = fs.readFileSync(expectedFolder + file, 'utf8');
				assert.equal(distFile, expectedFile, file  + ' komt niet overeen!');
			});
		});
	});
	  
  };

  describe('single', function() {
    const distFolderSingle = 'test/single/example/dist/';
    const expectedFolderSingle = 'test/single/expected/';

    it('de inhoud van de gebuilde dist folder komt overeen met de inhoud van de verwachte folder', function() {
      assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder(distFolderSingle, expectedFolderSingle);
    });
  });

  describe('multiple', function() {
    const distFolderMultiple = 'test/multiple/example/dist/';
    const expectedFolderMultiple = 'test/multiple/expected/';

    it('de inhoud van de gebuilde dist folder komt overeen met de inhoud van de verwachte folder', function() {
      assertDatDeInhoudVanDeDistFolderOvereenkomtMetDeExpectedFolder(distFolderMultiple, expectedFolderMultiple);
    });
  });
});