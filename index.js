// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

var images = require('./pics');

var router = express();
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
app.listen(process.env.PORT || 3000);
app.get('/', (req, res) => {
  res.send("Server chạy ngon lành.");
});
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'hoangpro') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
// Đoạn code xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // Nếu người dùng gửi tin nhắn đến
        if (message.message.text) {
          var text = message.message.text;
          if(text == 'hi' || text == "hello")
          {
            sendMessage(senderId, "Hoàng Đẹp Trai's Bot: " + 'Xin Chào', + "Bạn tên gì?");
          }
          else if (text == 'hạnh' || text == "Hạnh")
          {
            sendMessage(senderId, "Bạn có phải là con Heo không?");
          }
          else if (text == 'có' || text == "*đúng*")
          {
            sendMessage(senderId, "Bạn có phải là con Heo không?");
          }
          else if (text == 'không' || text == "sai")
          {
            sendMessage(senderId, message.postback.text);
          }
          else{sendMessage(senderId, "Hoàng Đẹp Trai's Bot: " + "Xin lỗi, câu hỏi của bạn chưa có trong hệ thống.");}
        }
      }
      else
      {
        handlePostback(senderId, message.postback);
      }
    }
  }
  res.status(200).send("OK");
});
// Gửi thông tin tới REST API để Bot tự trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAMxUXl9d1MBAAZCsKgaeRnvus0DQ8ks3aUzwZBwtcZAAc7XRVc1Xpkx1ZAfZA8EHvaJClZCKpg21MqyB2q6n4aLuuvhP0JGE6Lp9PiwNosfrBAqXZB6RdgFhbaDWqjgLFO5ZAI9s8BeQXH1l4tux2cgfnR8MXWCL6dn6SE5HEgvviL1nIZByJzBZC",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

//add new
function imageTemplate(type, sender_id){
    return {
        "attachment":{
            "type":"image",
            "payload":{
                "url": getImage(type, sender_id),
                "is_reusable":true
            }
        }
    }
}

function getImage(type, sender_id){
    // create user if doesn't exist
    if(users[sender_id] === undefined){
        users = Object.assign({
            [sender_id] : {
                'cats_count' : 0,
                'dogs_count' : 0
            }
        }, users);
    }

    let count = images[type].length, // total available images by type
        user = users[sender_id], // // user requesting image
        user_type_count = user[type+'_count'];


    // update user before returning image
    let updated_user = {
        [sender_id] : Object.assign(user, {
            [type+'_count'] : count === user_type_count + 1 ? 0 : user_type_count + 1
        })
    };
    // update users
    users = Object.assign(users, updated_user);

    console.log(users);
    return images[type][user_type_count];
}


// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = askTemplate();
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    response = imageTemplate('cats', sender_psid);
    callSendAPI(sender_psid, response, function(){
        callSendAPI(sender_psid, askTemplate('Show me more'));
    });

    // Set the response based on the postback payload
    // if (payload === 'CAT_PICS') {
    //     response = imageTemplate('cats', sender_psid);
    //     callSendAPI(sender_psid, response, function(){
    //         callSendAPI(sender_psid, askTemplate('Show me more'));
    //     });
    // } else if (payload === 'DOG_PICS') {
    //     response = imageTemplate('dogs', sender_psid);
    //     callSendAPI(sender_psid, response, function(){
    //         callSendAPI(sender_psid, askTemplate('Show me more'));
    //     });
    // } else if(payload === 'GET_STARTED'){
    //     response = askTemplate('Are you a Cat or Dog Person?');
    //     callSendAPI(sender_psid, response);
    // }
    // Send the message to acknowledge the postback
}





