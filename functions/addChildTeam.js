var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });

//Adds a relation between a parent team and child team

module.exports.handler = (event, context, callback) => {
    // TODO implement
    var dynamodb = new AWS.DynamoDB();
    
    var parentID = JSON.parse(event.body).parentid;
    var teamID = JSON.parse(event.body).teamid;

    var params = {
        TableName: 'TeamParentList',
        Item: {
            'ParentID': { S: parentID },
            'ID': { S: teamID }
        }
    };

    //Create response
    var response = {
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": false
    }


    // Call DynamoDB to add the item to the table
    dynamodb.putItem(params, function(err, data) {
        //Callback
        if (err) {
            response.statusCode = 500;
            response.success = false;
            response.body = err;
            callback(null, response);
        } else {
            response.statusCode = 200;
            response.success = true;
            callback(null, response);
        }
    });
};