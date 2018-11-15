const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

exports.handler = async () => {
  const params = {
    ExpressionAttributeNames: {
    "#tags": "tags",
    },
    TableName : 'CardTable',
    FilterExpression: "attribute_exists(#tags)",
  }
    const response = await dynamoDb.scan(params).promise()
    const allTags = response.Items.reduce((memo, card) => {
      const tagsArr = card.tags.split(',')
      return [...memo, ...tagsArr]
    }, [])

    const uniqueTags = allTags.reduce((memo, tag) => {
      if(!memo.find(item => item === tag)) {
        memo.push(tag)
      }
      return memo
    }, [])

    return {
      tags: uniqueTags
    }
};
