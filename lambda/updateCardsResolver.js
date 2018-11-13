const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (deckId) => {
  const params = {
    ExpressionAttributeValues: {
     ":deckId": deckId
    },
    TableName : 'CardTable',
    IndexName: 'deckId-index',
    KeyConditionExpression: "deckId = :deckId",
  }

  const response = await dynamoDb.query(params).promise()
  const updatedPromises = response.Items.map(card => {
    const newFront = card.back
    const newBack = card.front

    const updateParams = {
      TableName:'CardTable',
      Key:{
          "id": card.id
      },
      UpdateExpression: "set #b=:b, #f=:f",
      ExpressionAttributeValues:{
          ":f":newFront,
          ":b":newBack
      },
      ExpressionAttributeNames:{
        "#f":'front',
        "#b":'back'
      },
      ReturnValues:"ALL_NEW"
    };

    return dynamoDb.update(updateParams).promise()
  })
  const responsesAttr = await Promise.all(updatedPromises);
  const updatedCards = responsesAttr.map(item => item.Attributes)
  return updatedCards
};
