var AWS = require('aws-sdk');
var uuid = require('uuid');
//var getTeamName = require('./getTeamName');
AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(null);

var util = require('util');


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
                    var promises = [];
                    var dbp;
                    data.Items.forEach(function(element) {
                        console.log("element"+element.TeamID.S)
                        dbp = dynamodb.query(params = {
                            ExpressionAttributeValues: {
                                ":v1": {
                                    S: element.TeamID.S
                                }
                            },
                            KeyConditionExpression: "ID  = :v1",
                            TableName: "TeamList"
                        }).promise()

                        promises.push(dbp.then(function(teamData) {
                            console.log("Promise callback"+JSON.stringify(teamData))
                        }))
                    });

                    Promise.all(promises).then(() => console.log("CONSOLELOG CALLBACK"))
                }
            });
        }
    });
};

/*                        var params = {
                            ExpressionAttributeValues: {
                                ":v1": {
                                    S: element.TeamID.S
                                }
                            },
                            KeyConditionExpression: "ID  = :v1",
                            TableName: "TeamList"
                        };
                        dynamodb.query(params).promise().then(function(err,teamData) {
                            subTeamsArray.push(teamData)
                            console.log(subTeamsArray)
                        });*/ 