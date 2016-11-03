"use strict";

const fs = require('fs'),
  path = require('path'),
  request = require('request').defaults({ encoding: null }),
  imagediff = require('../imagediff.js'),
  Canvas = require('canvas'),
  Image = Canvas.Image;

class CompareImageDiff {
  /*
    Load a list of images. Callback is triggered when all the images in the list are loaded
   */
  _loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = sources.length;
    for(var src in sources) {
      this._loadSingleImage(sources[src], function(image, index) {
        images[loadedImages] = image;
        if(++loadedImages >= numImages) {
          callback(images);
        }
      });
    }
  }

  /*
  Load a single image with url
   */
  _loadSingleImage(url, callback) {
    request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var image = new Image();
        image.src = body;
        callback(image);
      }
    });
  }


  /*
  Output the image to outFilename
   */
  generateDiffImage(diff, outFilename) {
    var canvas = imagediff.createCanvas(diff.width, diff.height);
    var context = canvas.getContext('2d');
    context.putImageData(diff, 0, 0);
    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, outFilename)));
  }

  generateDiffHTML(diff) {
  //  var image1 =
  }

  /*
  Compare the two images
   */
  compareUrlImageDiff(filenameA, filenameB, callback) {
    var self = this;
    var cb = function(images) {
      self._compare(images[0], images[1], callback);
    };
    this._loadImages([filenameA, filenameB], cb);
  }

  /*
  The actual comparison using imagediff
   */
  _compare(a, b, callback) {
    var diff = imagediff.diff(a, b);
    var isEqual = imagediff.equal(a, b, 0);
    if (callback) {
      callback(isEqual, diff, [a, b]);
    }
  }
};

var compare = new CompareImageDiff();
compare.compareUrlImageDiff('http://raw.githubusercontent.com/tinayuangao/js-imagediff/master/examples/1_normal_a.jpg',
'http://raw.githubusercontent.com/tinayuangao/js-imagediff/master/examples/1_normal_b.jpg', function(isEqual, diff) {
    compare.generateDiffImage(diff, 'image-diff.png');
    console.log(isEqual);
  });


//compareImageDiff('1_normal_a.jpg', '1_normal_b.jpg', 'image-src.png');

// Upload generated screenshots
  // gsutil cp ~~~/~~~.png gs://my-awesome-bucket/prnumber
  // gsutil acl ch -u AllUsers:R gs://my-awesome-bucket/cloud-storage-logo.png

// access as https://storage.googleapis.com/<your-bucket-name>/quickstart-console.png

// Step 1, find all screenshot images
// download from gsutil cp Desktop/cloud-storage-logo.png gs://my-awesome-bucket
// gsutil ls gs://my-awesome-bucket/prnumber
//
// Step 2, loop through it
//   Step 2.1, compare the original with previous one
// Step 3, return result
// generate the html on the fly


// 1. Output images to html
// 2. Return final result