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
            response.body = JSON.stringify({"error":err});
            callback(null, response);
        }
        else {
            response.statusCode = 200;
            try {
                var bodyData = {
                    "id" : data.Items[0].ID.S,
                    "name":data.Items[0].Name.S
                };
            } catch (error) {
                var bodyData = {};
            }

            var params = {
                ExpressionAttributeValues: {
                    ":v1": {
                        S: teamID
                    }
                },
                KeyConditionExpression: "ParentID  = :v1",
                TableName: "TeamParentList"
            };
            dynamodb.query(params, function(err,data) {
                if (err) {
                    response.statusCode = 500;
                    response.body = JSON.stringify({"error":err});
                    callback(null, response);
                }else {
                    var subTeamsArray = [];
                    data.Items.forEach(function(element) {
                        var teamItem = {
                            "teamid" : element.TeamID.S,
                            "parentid" : element.ParentID.S,
                            "name": element.Name.S
                        }
                        subTeamsArray.push(teamItem)
                    });

                    bodyData.subteams = subTeamsArray
                    response.body = JSON.stringify(bodyData);
                    callback(null, response);
                }
            });
        }
    });
};