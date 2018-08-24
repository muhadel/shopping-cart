var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function (password) {
    console.log('password-->', password);
    console.log('this password-->', this.password);
    return bcrypt.compareSync(password, this.password);//this.password
    
}

module.exports = mongoose.model('User', userSchema);