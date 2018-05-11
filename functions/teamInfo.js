var AWS = require('aws-sdk');
var uuid = require('uuid');
//var getTeamName = require('./getTeamName');
AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(null);

var util = require('util');


module.exports.handler = (event, context, callback) => {
    //Create db object
    var dynamodb = new AWS.DynamoDB();

    //Get data from post
    var teamID = JSON.parse(event.body).teamid;
    //Create base response headers
    var response = {
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": false
    };

    //Create query params for teamlist
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
            //set status code to 200
            response.statusCode = 200;
            //Test if team is ROOT
            try {
                var bodyData = {
                    "id" : data.Items[0].ID.S,
                    "name":data.Items[0].Name.S
                };
            } catch (error) {
                var bodyData = {
                    "id"        : "ROOT",
                    "name"      : "ROOT",
                    "members"   : []
                };
            }
            //Create query for getting sub teams of team
            var params = {
                ExpressionAttributeValues: {
                    ":v1": {
                        S: teamID
                    }
                },
                KeyConditionExpression: "ParentID  = :v1",
                TableName: "TeamParentList"
            };
            //Query for sub teams
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
                        dbp = dynamodb.query(params = {
                            ExpressionAttributeValues: {
                                ":v1": {
                                    S: element.ID.S
                                }
                            },
                            KeyConditionExpression: "ID  = :v1",
                            TableName: "TeamList"
                        }).promise()

                        promises.push(dbp.then(function(teamData) {
                            console.log(teamData)
                            var subTeam = {
                                "teamid": teamData.Items[0].ID.S,
                                "name"  : teamData.Items[0].Name.S
                            }
                            subTeamsArray.push(subTeam)
                        }))
                    });


                    Promise.all(promises).then(function() {
                        bodyData.subteams = subTeamsArray
                        if (teamID == "ROOT") {
                            response.body = JSON.stringify(bodyData)
                            callback(null, response)
                        }else {
                            params = {
                                ExpressionAttributeValues: {
                                    ":v1": {
                                        S: teamID
                                    }
                                },
                                KeyConditionExpression: "TeamID = :v1",
                                TableName: "TeamMembersList"
                            }
                            dynamodb.query(params, function(err, memberData) {
                                memberDataArray = [];
                                memberData.Items.forEach(function(element) {
                                    var memberDataItem = {
                                        "id"        : element.ID.S,
                                        "userpoolid": element.UserPoolID.S,
                                        "name"      : element.Name.S
                                    }
                                    memberDataArray.push(memberDataItem);
                                })

                                bodyData.members = memberDataArray
                                response.body = JSON.stringify(bodyData)
                                callback(null, response)
                            })
                        }
                    })
                    //callback(null, response)
                }
            });
        }
    });
};