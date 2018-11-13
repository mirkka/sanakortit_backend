const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (source) => {
    const deckId = source.id
    const hour = 1000 * 60 * 60;
    const dueDate = Date.now() + hour

    const params = {
        TableName:'CardTable',
        ExpressionAttributeValues: {
            ":id": deckId,
            ":dueDate": dueDate
        },
        FilterExpression: 'deckId = :id and weight < :dueDate'
    };

  const response = await dynamoDb.scan(params).promise()
  return response.Count
};
