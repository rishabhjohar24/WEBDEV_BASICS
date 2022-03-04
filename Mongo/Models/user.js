const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/learning', {useNewUrlParser: true})
    .then(() => {
        console.log('Mongo is connectd!!!');
    })
    .catch((err) => {
        console.log('Something is wong :(');
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    address: [
        {
            street: String,
            city: String,
            state: String,
            contry: String,
        }
    ]
});
const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: 'Rishabh',
        last: 'Johar',
    })
    u.address.push({
        street: 'Lohar Patti',
        city: 'Manawar',
        state: 'Madhya Pradesh',
        contry: 'India'
    })
    const res = await u.save();
    console.log(res);
}

makeUser();