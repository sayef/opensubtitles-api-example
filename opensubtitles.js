var fs = require('fs');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('TESTAGENT');


OpenSubtitles.search({
    imdbid: 'tt0314979',
    sublanguageid: 'eng',
    gzip: true
}).then(subtitles => {
    if (subtitles.en) {
        console.log('Subtitle found:', subtitles);
        require('request')({
            url: subtitles.en.url,
            encoding: null
        }, (error, response, data) => {
            if (error) throw error;
            require('zlib').unzip(data, (error, buffer) => {
                if (error) throw error;
                const subtitle_content = buffer.toString(subtitles.en.encoding);
                fs.writeFile("tt0314979.txt", subtitle_content, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            });
        });
    } else {
        throw 'no subtitle found';
    }
}).catch(console.error);
