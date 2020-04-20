const graphql = require('graphql')
const joinMonster = require('join-monster')
const db = require("../db");

const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    employees: {
      type: new graphql.GraphQLList(Employee),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return db.client.query(sql)
        })
      }
    },
    employee: {
      type: Employee,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (employee_table, args, context) => `${employee_table}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return db.client.query(sql)
        })
     }
    },
    teams: {
      type: new graphql.GraphQLList(Team),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return db.client.query(sql)
        })
      }
    }
  })
})

/**
 * Create the DB Mapping from Postgresql to Our GraphQLModel
 */

const Employee = new graphql.GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    class: { type: graphql.GraphQLString },
    employee_code: { type: graphql.GraphQLString },
    manager: {
      type: Employee,
      sqlJoin: (employee_table, employee_table_manager, args) => `${employee_table}.direct_manager = ${employee_table_manager}.id`
    },
    direct_reports: {
      type: new graphql.GraphQLList(Employee),
      sqlBatch: {
        thisKey: 'direct_manager',
        parentKey: 'id'
      }
    }
  })
})

Employee._typeConfig = {
  sqlTable: 'employee',
  uniqueKey: 'id'
}

const Player = new graphql.GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    team: {
      type: Team,
      sqlJoin: (playerTable, teamTable, args) => `${playerTable}.team_id = ${teamTable}.id`
    }
  })
});
    
Player._typeConfig = {
  sqlTable: 'player',
  uniqueKey: 'id',
}
    
var Team = new graphql.GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    members: {
      type: new graphql.GraphQLList(Employee),
      junction: {
        sqlTable: 'team_member',
        sqlJoins: [
        (teamTable, junctionTable, args) => `${teamTable}.id = ${junctionTable}.team_id`,
          // then the junction to the child
        (junctionTable, employeeTable, args) => `${junctionTable}.member_id = ${employeeTable}.id`
      ]
      }
    }
  })
})
    
Team._typeConfig = {
  sqlTable: 'team',
  uniqueKey: 'id'
}

exports.QueryRoot = QueryRoot;
exports.Team = Team;
exports.Employee