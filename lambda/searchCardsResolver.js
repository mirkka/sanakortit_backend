const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
  const {deckId, phrase, tag} = event;

  const params = {
    ExpressionAttributeValues: {
     ":phrase": phrase
    },
    ExpressionAttributeNames: {
     "#back": "back",
     "#front": "front"
    },
    TableName : 'CardTable',
    FilterExpression: "contains(#front, :phrase) or contains(#back, :phrase)",
  }

  const response = await dynamoDb.scan(params).promise()

  const uniqueCards = response.Items.reduce((memo, item) => {
    if(!memo.find(card => card.id === item.id)) {
      memo.push(item)
    }
    return memo
  }, [])

  if(deckId) {
    return {
      items: uniqueCards.filter(item => item.deckId === deckId)
    }
  }

  if(tag) {
    return {
      items: uniqueCards.filter(item => {
        const tagsArr = item.tags.split(',')
        if(tagsArr.find(itemTag => itemTag === tag)) {
          return item
        }
      })
    }
  }

  return {
    items: uniqueCards
  }
};
