const neo4j = require('neo4j-driver');
const fs = require( "fs");
const path = require("path")
const {retrieveHierarchyUpwards, retrieveHierarchyDownwards} = require("../db/dao")
const typeDefs = fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")).toString("utf-8");


const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '123qwe')
);

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

exports.resolvers = {
  // root entry point to GraphQL service
  Mutation: {
    createAdvisorNoManager(obj, params, ctx){
      let session = ctx.driver.session()
      let queryParams = {
        props: {
          'lastName': params.lastName || "",
          'nickName': params.nickName  || "",
          'companyName': params.companyName || "",
          'birthDate': params.birthDate || "",
          'titleCode': params.titleCode || "",
          'birthPlace': params.birthPlace || "",
          'firstName': params.firstName || "",
          'number': params.number || "",
          'nationalityCode': params.nationalityCode || "",
          'genderCode': params.genderCode || "",
          'classificationCode': params.classificationCode || "",
          'civilStatusCode': params.civilStatusCode || "",
          'profileTypeCode': params.profileTypeCode || "",
          'middleName': params.middleName || "",
          'effectiveDate': params.effectiveDates || "",
          'suffixCode': params.suffixCode || "",
          'hash': uuidv4()
      }
    }
 
    let code = uuidv4()
    let jampackedQuery = `
    CREATE (basicInfo:BasicInfo $props)
    CREATE (advisor: Advisor {hash: '${code}'})<-[:IS_BASIC_INFO_OF]-(basicInfo)
    `
    jampackedQuery+='return basicInfo, advisor'
      return session.run(jampackedQuery, queryParams) .then(result => {
         return result.records.map(record => {
           advisor = record.get('advisor').properties
           advisor['info'] = [record.get('basicInfo').properties]
           console.log(advisor)
        return advisor
        })
      })
    },
    createAdvisorWithManager(obj, params, ctx){
      let session = ctx.driver.session()
      let managerHash = params.managerId
      let queryParams =    {
        props: {
          'lastName': params.lastName || "",
          'nickName': params.nickName  || "",
          'companyName': params.companyName || "",
          'birthDate': params.birthDate || "",
          'titleCode': params.titleCode || "",
          'birthPlace': params.birthPlace || "",
          'firstName': params.firstName || "",
          'number': params.number || "",
          'nationalityCode': params.nationalityCode || "",
          'genderCode': params.genderCode || "",
          'classificationCode': params.classificationCode || "",
          'civilStatusCode': params.civilStatusCode || "",
          'profileTypeCode': params.profileTypeCode || "",
          'middleName': params.middleName || "",
          'effectiveDate': params.effectiveDates || "",
          'suffixCode': params.suffixCode || "",
      }
    } 
    //make this auto generated
    let jampackedQuery = `
      MATCH (manager:Advisor)-[r:MEMBER_OF]->(team:Team)
      WHERE manager.hash = '${managerHash}'
      CREATE (basicInfo:BasicInfo $props)
      CREATE (newAdvisor:Advisor {hash: ${advisorHash}})
      CREATE (basicInfo) - [basic_info_of:IS_BASIC_INFO_OF] -> (newAdvisor)
      CREATE (newAdvisor) - [na_reports_to:REPORTS_TO] -> (manager)
      CREATE (newAdvisor) - [na_member_of:MEMBER_OF] -> (team)
      RETURN newAdvisor as newAdvisor, na_member_of, na_reports_to, manager, team`
      return session.run(jampackedQuery, queryParams) .then(result => {
         return result.records.map(record => {
        return record._fields[0].properties
        })
      })
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