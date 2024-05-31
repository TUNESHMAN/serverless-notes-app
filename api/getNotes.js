// ROUTE : GET /notes

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

// Instantiate dybnamodb
const dynamodb = new AWS.DynamoDB.DocumentClient();
// Bring in the table
const tableName = process.env.NOTES_TABLE;

const utils = require("../api/util.js");

exports.handler = async (event) => {
  try {
    let item = {};
    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 5;
    item.user_id = utils.getUserId(event.headers);
    let params = {
      TableName: tableName,
      KeyConditionExpression: "user_id = :uid",
      ExpressionAttributeValues: {
        ":uid": item.user_id,
      },
      Limit: limit,
      ScanIndexForward: false,
    };
    let startTimestamp = query && query.start ? parseInt(query.start) : 0;
    if (startTimestamp > 0) {
      params.ExclusiveStartKey = {
        user_id: item.user_id,
        timestamp: startTimestamp,
      };
    }

    let data = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log("Error", error);
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify({
        error: error.name ? error.name : "Exception",
        message: error.message ? error.message : "Unknown error",
      }),
    };
  }
};
