var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });


module.exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();

    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: JSON.parse(event.body).teamid
            }
        },
        KeyConditionExpression: "ParentID = :v1",
        TableName: "TeamsTbl"
    };
    dynamodb.query(params, function(err, data) {
        var response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": '*'
            },
            "body": JSON.stringify(data),
            "isBase64Encoded": false
        };
        if (err) console.log(err, err.stack); // an error occurred
        else callback(null, response); // successful response
    });
};