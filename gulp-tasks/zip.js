const fs = require('fs-extra');
const archiver = require('archiver');
const gulp = require('gulp');
const path = require('path');

async function zip() {
  const zipPath = path.join(__dirname, '..', 'gauntface-extension.zip');
  await fs.remove(zipPath);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: {
      // Sets the compression level
      level: 9,
    }
  });

  return new Promise((resolve, reject) => {
    output.on('close', function() {
      resolve();
    });
   
    output.on('end', function() {
      console.log('Output End event');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.warn(`Archiver warning: ${err.message}`);
      } else {
        reject(err);
      }
    });
  
    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      reject(err);
    });
    
    // pipe archive data to the file
    archive.pipe(output);
    
    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory(global.__buildConfig.dest, 'gauntface-extension');
    
    // append files from a sub-directory, putting its contents at the root of archive
    // archive.directory('subdir/', false);
    
    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });
}

module.exports = zip;