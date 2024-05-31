// ROUTE : PATCH /note

const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });

// Instantiate dybnamodb
const dynamodb = new AWS.DynamoDB.DocumentClient();
// Bring in the table
const tableName = process.env.NOTES_TABLE;
const moment = require("moment");
const utils = require("../api/util.js")


exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = utils.getUserId(event.headers);
    item.user_name = utils.getUsername(event.headers);
    item.expires = moment().add(90, "days").unix();
    let data = await dynamodb
      .put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "#t = :t",
        ExpressionAttributeNames: {
          "#t": "timestamp",
        },
        ExpressionAttributeValues: {
          ":t": item.timestamp,
        },
      })
      .promise();
    return {
      statusCode: 200,
      headers: utils.getResponseHeaders(),
      body: JSON.stringify(item),
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
