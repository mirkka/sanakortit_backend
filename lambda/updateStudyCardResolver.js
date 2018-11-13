const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const hour = 1000 * 60 * 60;
const day = hour * 24;
const levelWeights = [
    1000 * 60 * 10,
    1000 * 60 * 10,
    day,
    day * 3,
    day * 4,
    day * 7
];

const randomWeight = async deckId => {
    let start;
    let end;

    const params = {
        ExpressionAttributeValues: {
         ":deckId": deckId
        },
        TableName : 'CardTable',
        IndexName: 'deckId-index',
        KeyConditionExpression: "deckId = :deckId",
    }

    const response = await dynamoDb.query(params).promise()
    const allCards = response.Items

    if (allCards.length === 1) {
        start = allCards[0].weight;
    } else {
        start = allCards[1].weight;
    }
    if (allCards.length >= 7) {
        end = allCards[6].weight;
    } else {
        end = allCards[allCards.length - 1].weight;
    }
    // + 1 adds milisecond to timestamp to ensure rotation when there are only two cards left
    return Math.round(Math.random() * (end - start)) + start + 1;
}

exports.handler = async (input) => {
    const {action, id, level, deckId} = input
    let newWeight
    let newLevel

    if (action === 'good') {
        newWeight = Date.now() + levelWeights[level]

        if(level === 0 || level === 1) {
            newWeight = await randomWeight(deckId)
        }

        if(level < 5) {
            newLevel = level + 1
        }

    }

    if(action === 'again') {
        newWeight = await randomWeight(deckId)
        if(level > 1) {
            newLevel = 1
        } else {
            newLevel = 0
        }
    }

    const params = {
        ExpressionAttributeValues:{
            ":w":newWeight,
            ":l":newLevel,
        },
        ExpressionAttributeNames: {
            "#l": 'level'
        },
        Key:{
            "id": id,
        },
        UpdateExpression: "set weight = :w, #l=:l",
        TableName:'CardTable',
        ReturnValues:"ALL_NEW"
    };

  const response = await dynamoDb.update(params).promise()
  return response.Attributes
};
