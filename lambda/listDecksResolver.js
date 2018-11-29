const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (user) => {
  const params = {
    ExpressionAttributeValues: {
    ":user": user
    },
    ExpressionAttributeNames: {
    "#author": "author",
    },
    TableName : 'DeckTable',
    FilterExpression: "#author = :user",
  }
  const response = await dynamoDb.scan(params).promise()
  return {
    items: response.Items
  }
};
