var express = require('express');
var app = express(); 

var counter = 0;
var allMsgs = [
  {
    "msg": "Hello World",
    "pseudo": "System", 
    "date": new Date().toISOString()
  },
  {
    "msg": "Send Money",
    "pseudo": "Admin", 
    "date": new Date().toISOString()
  },
  {
    "msg": "CentraleSupelec & IPSA 4ever",
    "pseudo": "Student", 
    "date": new Date().toISOString()
  },
  {
    "msg": "Made with ❤️ by Antoine CASTEL",
    "pseudo": "tonio", 
    "date": new Date().toISOString()
  }
];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function(req, res) {
  res.send("Hello beau gosse")
})

app.get('/test/*', function(req, res) {
  // Extract the part after "/test/"
  const message = req.path.split('/test/')[1];
  res.json({"msg": message});
});

app.get('/cpt/query', function(req, res) {
  res.json({ counter: counter });
});

app.get('/cpt/inc', function(req, res) {
  // Check if a value parameter was provided
  if (req.query.v !== undefined) {
    const increment = parseInt(req.query.v);
    
    // Check if it's a valid integer
    if (!isNaN(increment) && increment.toString() === req.query.v) {
      counter += increment;
      res.json({ code: 0 });
    } else {
      res.json({ code: -1 });
    }
  } else {
    counter += 1;
    res.json({ code: 0 });
  }
});

// Route to get a specific message by its index
app.get('/msg/get/*', function(req, res) {
  const msgNumber = parseInt(req.path.split('/msg/get/')[1]);
  
  // Check if it's a valid integer and if the message exists
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    res.json({ "code": 1, "msg": allMsgs[msgNumber] });
  } else {
    res.json({ "code": 0 });
  }
});

// Route to get the number of messages
app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});

// Route to get all messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

// Route to post a new message
app.get('/msg/post/*', function(req, res) {
  const messagePath = req.path.split('/msg/post/')[1];
  const decodedMessage = decodeURIComponent(messagePath);
  
  // Get pseudo from query or use "Anonymous" if empty
  const pseudo = req.query.pseudo ? decodeURIComponent(req.query.pseudo) : "Anonymous";
  
  // Message object with metadata
  const messageObject = {
    "msg": decodedMessage,
    "pseudo": pseudo,
    "date": new Date().toISOString() // ISO format for easier parsing
  };
  
  allMsgs.push(messageObject);
  res.json(allMsgs.length - 1);
});

// Route to delete a message
app.get('/msg/del/*', function(req, res) {
  const msgNumber = parseInt(req.path.split('/msg/del/')[1]);
  
  // Check if it's a valid integer and if the message exists
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    allMsgs.splice(msgNumber, 1);
    res.json({ "code": 1 });
  } else {
    res.json({ "code": 0 });
  }
});

app.listen(8080);
console.log("App listening on port 8080...");

