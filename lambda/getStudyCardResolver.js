const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (deckId) => {
    const hour = 1000 * 60 * 60;
    const dueDate = Date.now() + hour

    const getCardsParams = {
        ExpressionAttributeValues: {
         ":deckId": deckId
        },
        TableName : 'CardTable',
        IndexName: 'deckId-index',
        KeyConditionExpression: "deckId = :deckId",
    }
    const response = await dynamoDb.query(getCardsParams).promise()
    console.log(JSON.stringify(response))
    const sortedCards = response.Items.sort((a, b) => {
        return a.weight - b.weight
    })
    const studyCard = sortedCards.find(item => item.weight < dueDate)
    return studyCard
};
