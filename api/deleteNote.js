// ROUTE : DELETE /note/t/{timestamp}

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

// Instantiate dybnamodb
const dynamodb = new AWS.DynamoDB.DocumentClient();
// Bring in the table
const tableName = process.env.NOTES_TABLE;

const utils = require("../api/util.js")

exports.handler = async (event) => {
  try {
    let timestamp = parseInt(event.pathParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        user_id: utils.getUserId(event.headers),
        timestamp: timestamp,
      },
    };

    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
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
