var mongoose = require('mongoose');
var Event = require('./models/event');
var Comment = require('./models/comment');

var data = [
    {
        name: "New Year's Party",
        image: "https://bit.ly/2RmsbMt",
        description: "Attend this event to be a part of the biggest new year's bash ever. Usher in the 2019 with pomp and circumstance.",
    },

    {
        name: "Fancy Dinner",
        image: "https://bit.ly/2TljEXj",
        description: "Attend this dinner to feel and act like you are part of royalty event though your lifestyles aren't even close to comparison.",
    },

    {
        name: "Barbeque",
        image: "https://bit.ly/2CHtCwz",
        description: "This is an all you can eat barbeque. Be sure to contribute by bringing your own utensils and other stuff",
    },

    {
        name: "Hackathon",
        image: "https://bit.ly/2TjnrEz",
        description: "This event is all about coding the next 48 hrs away. Make your own version the next product to take the world by storm."
    },

    {
        name: "Standup Comedy",
        image: "https://bit.ly/2Aocqei",
        description: "Attend this event to laugh away the evening. Performing on stage is renowned comedian XYZ who is sure to have you falling of your chairs!"
    },

];


function seedDB(){
    Event.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed all events");
        Comment.deleteMany({}, function(err){
            if(err){
                console.log(err);
            }
            
            data.forEach(function(event){
                Event.create(event, function(err, createdEvent){
                    if(err){
                        console.log(err);
                    }
                    console.log("Event created" + createdEvent.name);
                    Comment.create({
                        text: "This place is sophisticated but not sophisticated enough for me.",
                        author: "Bruce Wayne",
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            createdEvent.comments.push(comment);
                            createdEvent.save();
                            console.log("Created new comment");
                        }
                    });
                });
            });

        });
    });
}

module.exports = seedDB








