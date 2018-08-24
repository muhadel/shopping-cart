var Product = require('../models/product');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true });

var products = [
    new Product({
        imagePath: 'https://s3-us-west-2.amazonaws.com/gplaygames/leage_of_legends.jpg',
        title: 'League Of Legends',
        description: 'fire Game',
        price: 20
    }),
    new Product({
        imagePath: 'https://static-ca.ebgames.ca/images/products/724311/3max.jpg',
        title: 'Call Of Duty',
        description: 'fire Game',
        price: 20
    }),
    new Product({
        imagePath: 'http://images5.fanpop.com/image/photos/29800000/S4-League-Group-s4-league-29861068-530-902.jpg',
        title: 'S4 League',
        description: 'Anime shooter',
        price: 50
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!',
        price: 15
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/c/cf/Pro_Evolution_Soccer_2019_Cover_Art.jpg',
        title: 'PES 2019',
        description: 'Soccer Game',
        price: 20
    }),
    new Product({
        imagePath: 'https://free-apk.info/wp-content/uploads/2018/06/CrossFire-Legends-APK1.jpg',
        title: 'Cross Fire',
        description: 'fire shooting game',
        price: 50
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

var exit = () => {
    mongoose.disconnect();
};