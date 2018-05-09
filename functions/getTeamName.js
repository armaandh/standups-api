var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({ region: 'us-east-1' });
var util = require('util');

/*
var getTeamName = (item) => {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: item.TeamID.S
            }
        },
        KeyConditionExpression: "ID  = :v1",
        TableName: "TeamList"
    };
        return new Promise(resolve => setTimeout(() => resolve(
)
        ), 100));        
};

module.exports = getTeamName;

/*        dynamodb.query(params, function(err,teamData) {
            if (err) {
                return err;
            }else {
                return teamData;
            }
        })*/