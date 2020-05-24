const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CounterSchema = new Schema({
    idType: {
        type: String
    },
    seq: {
        type: Number,
        default: 0
    }

});

module.exports = Counter = mongoose.model("counters", CounterSchema); 