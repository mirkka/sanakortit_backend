const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (args) => {
    const card = args[0]
    const id = args[1].S
    let newCard = {
        front: card.front,
        back: card.back,
        deckId: card.deckId,
        weight: Date.now(),
        level: 0,
        id: id,
        author: card.author
    }

    if(card.tags !== null) {
        newCard.tags = card.tags
    }

    const params = {
        TableName:'CardTable',
        Item:newCard
    };

  const response = await dynamoDb.put(params).promise()
  return newCard
};
