/**
 * Created by leejunghyun on 16. 2. 11..
 */

var easyimg = require('easyimage'),
    fs = require('fs');

exports.confirmHandler = function(req, res){
    console.log("후후");
    easyimg.info('test.png').then(
        function(file) {
            console.log(file);
            easyimg.rescrop({
                src:'test.png', dst:'./output/kitten-thumbnail.jpg',
                width:500, height:500,
                cropwidth:128, cropheight:128,
                x:0, y:0
            }).then(
                function(image) {
                    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                },
                function (err) {
                    console.log(err);
                }
            );

        }, function (err) {
            console.log(err);
        }
    );

    res.end();
}

exports.uploadHandler = function(req, res){
    fs.readFile(req.files.uploadFile.path, function(error,data){
        var destination = req.files.uploadFile.name;
        fs.writeFile(destination,data,function(error){
            if(error){
                console.log(error);
                throw error;
            }else{
                res.redirect('back');
            }
        });
    });
}