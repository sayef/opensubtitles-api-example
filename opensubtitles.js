var fs = require('fs');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('TEST_AGENT');
var csv = require("fast-csv");
const cp = require('child_process');
var movie_list = process.argv.slice(2)[0];

csv
 .fromPath(movie_list, {delimiter : '\t', headers : ["imdb_id", "movie_title", "year"]})
 .on("data", function(data){
   //console.log(data);
   sleep(1000*60).then(() => {
     download(data.imdb_id);
   })
 })
 .on("end", function(){
      console.log("SUCCESS: Done loading csv file!");
 });

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function download(id){
  OpenSubtitles.search({
      imdbid: id,
      sublanguageid: 'eng',
      gzip: true
  }).then(subtitles => {
      if (subtitles.en) {
          console.log('SUCCESS: Subtitle found:\n', subtitles);
          if(!fs.exists('subtitles/'+subtitles.en.id+'.gz')) {
              cp.exec('cd subtitles/ && wget ' + subtitles.en.url + ' && gunzip ' + subtitles.en.id + '.gz', (error, stdout, stderr) => {
                  if (error) {
                      console.error(`exec error: ${error}`);
                      return;
                  }
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
              });
          }
      } else {
          console.log('FAILURE: No subtitle found for ' + id);
      }
  }).catch(console.error);
}
