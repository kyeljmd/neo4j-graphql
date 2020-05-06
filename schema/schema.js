const fs = require( "fs");
const path = require("path")
const {retrieveHierarchyUpwards, retrieveHierarchyDownwards,
  createAdvisor, createAdvisorWithManager, driver} = require("../db/dao")
const typeDefs = fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")).toString("utf-8");

exports.resolvers = {
  // root entry point to GraphQL service
  Mutation: {
    createAdvisorNoManager(obj, params, ctx){
      return createAdvisor(params)
    },
    createAdvisorWithManager(obj, params, ctx){
      return createAdvisorWithManager(params)
    }
  },
  Advisor: {
    hierarchyUpwards(parent, _, ctx) {
      return retrieveHierarchyUpwards(parent.hash)
    },
    hierarchyDownwards(parent, _, ctx) {
      return retrieveHierarchyDownwards(parent.hash)
    }
  }
};

exports.typeDefs = typeDefs;
exports.driver = driver;