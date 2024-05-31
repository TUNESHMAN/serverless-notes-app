// ROUTE : GET /note/n/{note_id}

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

// Instantiate dybnamodb
const dynamodb = new AWS.DynamoDB.DocumentClient();
// Bring in the table
const tableName = process.env.NOTES_TABLE;

const utils = require("../api/util.js")

const _ = require("underscore");

exports.handler = async (event) => {
  try {
    let note_id = decodeURIComponent(event.pathParameters.note_id);
    let params = {
      TableName: tableName,
      IndexName: "note_id-index",
      KeyConditionExpression: "note_id = :note_id",
      ExpressionAttributeValues: {
        ":note_id": note_id,
      },
      Limit: 1,
    };

    let data = await dynamodb.query(params).promise();
    if (!_.isEmpty(data.Items)) {
      return {
        statusCode: 200,
        headers: utils.getResponseHeaders(),
        body: JSON.stringify(data.Items[0]),
      };
    } else {
      return {
        statusCode: 404,
        headers: utils.getResponseHeaders(),
      };
    }
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
