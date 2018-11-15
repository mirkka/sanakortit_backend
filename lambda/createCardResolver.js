const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (args) => {
    const card = args[0]
    const id = args[1].S
    const newCard = {
        front: card.front,
        back: card.back,
        deckId: card.deckId,
        weight: Date.now(),
        tags: card.tags,
        level: 0,
        id: id
    }
    const params = {
        TableName:'CardTable',
        Item:newCard
    };

  const response = await dynamoDb.put(params).promise()
  return newCard
};
