var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-2' });


module.exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();

    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: event.teamid
            }
        },
        KeyConditionExpression: "TeamID  = :v1",
        TableName: "TeamMembersTbl"
    };
    dynamodb.query(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else callback(null, data); // successful response
    });
};