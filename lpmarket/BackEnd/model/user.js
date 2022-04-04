const mongoose = require('mongoose');
const bCrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        //unique: true,
    },
    phonenumber: {
        type: String,
        required: true,
        //unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

userSchema.pre('save', async function(next)
{
    if (this.isModified('password'))
    {
        const hash = await bCrypt.hash(this.password, 8);
        this.password = hash;
    }

    next();
})

userSchema.methods.comparePassword = async function(password){
    const result = await bCrypt.compareSync(password, this.password);
    return result;
}

module.exports = mongoose.model('User', userSchema)