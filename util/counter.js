const Counter = require('../models/Counter');

module.exports = async function getNextNumber() {
    let number = 0;
    number = await Counter.findOneAndUpdate({}, { $inc: { seq: 1 } }, { new: true })
        .then(counter => {
            if (counter) {
                number = counter.seq;
            }
            return number;
            
        })
        .catch(err => console.log(err));
    return number;
}
