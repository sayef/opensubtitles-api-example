var fs = require('fs');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('TEST_AGENT');
var csv = require("fast-csv");
var wget = require('node-wget');
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
              wget({
                      url: subtitles.en.url,
                      dest: 'subtitles/',      // destination path or path with filenname, default is ./
                      timeout: 3600000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
                  },
                  function (error, response, body) {
                      if (error) {
                          console.log('ERROR: ' + error);
                      } else {
                          // console.log('--- headers:');
                          // console.log(response.headers); // response headers
                          // console.log('--- body:');
                          // console.log(body);             // content of package
                          console.log('SUCCESS: ' + id + ' downloaded!');
                      }
                  }
              );
          }

      } else {
          console.log('FAILURE: No subtitle found for ' + id);
      }
  }).catch(console.error);
}
