// This is a node.js app to accept browser-recorded audio and store it in WAV format
// It is based on this article: https://blog.groupbuddies.com/posts/39-tutorial-html-audio-capture-streaming-to-nodejs-no-browser-extensions
// and this codebase: https://github.com/gabrielpoca/browser-pcm-stream

var express = require('express');
var binaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');

var port = 3700;
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(port);

var binaryServer = binaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log('new connection');

  var fileWriter = new wav.FileWriter('demo2.wav', {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log("new stream");
    stream.pipe(fileWriter);

    stream.on('end', function() {
      fileWriter.end();
    });
  });
});