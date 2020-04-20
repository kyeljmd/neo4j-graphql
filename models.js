const graphql = require('graphql')
const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "Hello world!"
    }
  })
})
exports.QueryRoot = QueryRoot;