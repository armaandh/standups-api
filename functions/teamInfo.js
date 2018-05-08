var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });

module.exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();

    //Get data from post
    var teamID = JSON.parse(event.body).teamid;

    var response = {
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": false
    };

//Create query params
    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: teamID
            }
        },
        KeyConditionExpression: "ID  = :v1",
        TableName: "TeamList"
    };
    //Get team name
    dynamodb.query(params, function(err, data) {
        if (err) { 
            response.statusCode = 500;
            response.body = JSON.stringify(err);
            callback(null, response);
        }
        else {
            response.statusCode = 200;
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
};