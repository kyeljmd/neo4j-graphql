const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')
const models = require("./schema/graphql");
const schema = new graphql.GraphQLSchema({ query: models.QueryRoot });
const { ApolloServer, gql } = require('apollo-server-express');
const app = express();
app.use(logger('dev'));
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true
})); 

//neo4j-graphql-related stuff
const apolloTypeDef = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const apolloResolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const apolloServer = new ApolloServer({ typeDefs: apolloTypeDef, resolvers: apolloResolvers });
apolloServer.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
