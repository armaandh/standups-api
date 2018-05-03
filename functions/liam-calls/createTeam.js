var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({region: 'us-east-2'});


exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
      TableName: 'Teams',
      Item: {
        'ParentID' : {S: event.parentid},
        'ID': {S: `${uuid.v1()}`},
        'Name' : {S: event.name}
      }
    };
    
    // Call DynamoDB to add the item to the table
    dynamodb.putItem(params, function(err, data) {
      if (err) {
        callback(null, err);
      } else {
        callback(null, data);
      }
    });
};