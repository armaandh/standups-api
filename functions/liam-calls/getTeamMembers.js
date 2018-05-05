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
        KeyConditionExpression: "TeamID  = :v1",
        TableName: "TeamMembers"
    };
    dynamodb.query(params, function(err, data) {
        var response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value"
            },
            "body": JSON.stringify(data),
            "isBase64Encoded": false
        };
        if (err) console.log(err, err.stack); // an error occurred
        else callback(null, data); // successful response
    });
};