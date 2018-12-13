const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const _ = require('lodash')

exports.handler = async (deckId) => {
    //delete deck
    const deleteDeckparams = {
        ExpressionAttributeValues: {
         ":id": deckId
        },
        Key:{
            "id": deckId
        },
        TableName : 'DeckTable',
        ConditionExpression: "id = :id"
    }

    const deletedDeck = await dynamoDb.delete(deleteDeckparams).promise()

    //delete all cards in the deck
    const getCardsparams = {
        ExpressionAttributeValues: {
         ":deckId": deckId
        },
        TableName : 'CardTable',
        IndexName: 'deckId-index',
        KeyConditionExpression: "deckId = :deckId"
    }

    const response = await dynamoDb.query(getCardsparams).promise()
    const updatedPromises = _.map(response.Items, (card) => {
        const cardId = card.id

        const deleteParams = {
          TableName:'CardTable',
          Key:{
              "id": card.id
          },
          ConditionExpression: "id=:id",
          ExpressionAttributeValues:{
              ":id":cardId
          },
        };

        return dynamoDb.delete(deleteParams).promise()
    })

    const responsesAttr = await Promise.all(updatedPromises);
    return {id: deckId}
};
