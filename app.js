const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')
const models = require("./schema/graphql");
const schema = new graphql.GraphQLSchema({ query: models.QueryRoot });
const { ApolloServer, gql } = require('apollo-server-express');
const{ makeAugmentedSchema, augmentSchema} = require('neo4j-graphql-js')
const {makeExecutableSchema} = require('apollo-server')
const {typeDefs, resolvers} = require("./schema/schema");
const neo4j  = require('neo4j-driver');

const app = express();
app.use(logger('dev'));
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true
})); 

//neo4j-graphql-related stuff
const apolloTypeDef = typeDefs

// Provide resolver functions for your schema fields
const apolloResolvers = resolvers


const augmentedSchema = makeAugmentedSchema({ typeDefs });



const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '123qwe')
);

const apolloServer = new ApolloServer({ schema: augmentedSchema,
  typeDefs: apolloTypeDef, resolvers: apolloResolvers,context:{driver} });

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
