const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const deckId = event.id;

  const params = {
    ExpressionAttributeValues: {
     ":deckId": deckId
    },
    TableName : 'CardTable',
    FilterExpression: "deckId = :deckId",
  }

  const response = await dynamoDb.scan(params).promise()
  return response.Count
};
