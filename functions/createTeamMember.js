var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });

module.exports.handler = (event, context, callback) => {
    var dynamodb = new AWS.DynamoDB();
    //Get data from post
    var teamID = JSON.parse(event.body).teamid;
    var userPoolID = JSON.parse(event.body).upoolid;
    var name = JSON.parse(event.body).name;
    var memberID = uuid.v1();
    //Create base response headers
    var response = {
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": false
    };

    var params = {
        TableName: 'TeamMembersList',
        Item: {
            'TeamID'    : { S: teamID },
            'ID'        : { S: memberID },
            'Name'      : { S: name},
            'UserPoolID': { S: userPoolID }
        }
    };
    dynamodb.putItem(params, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);
            callback(null, response);
        }else {
            response.statusCode = 200;
            response.body = JSON.stringify({"memberid":memberID});
            callback(null, response);
        }
    })
}