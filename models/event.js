var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var eventSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);



