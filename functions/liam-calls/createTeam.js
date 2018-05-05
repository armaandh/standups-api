var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });


module.exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName: 'Teams',
        Item: {
            'ParentID': { S: JSON.parse(event.body).parentid },
            'ID': { S: `${uuid.v1()}` },
            'Name': { S: JSON.parse(event.body).name }
        }
    };

    // Call DynamoDB to add the item to the table
    dynamodb.putItem(params, function(err, data) {
        var response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value"
            },
            "body": JSON.stringify(data),
            "isBase64Encoded": false
        };
        if (err) {
            callback(null, err);
        } else {
            callback(null, data);
        }
    });
};