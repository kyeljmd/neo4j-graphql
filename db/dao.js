const neo4j = require('neo4j-driver');
const {buildBasicInfoProps} = require('./dao-utils')
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '123qwe')
);  
exports.driver = driver;
exports.retrieveDistributionChannel = () => {
  let session = driver.session()
  let query = `CALL apoc.cypher.run("MATCH (e:Entity)<-[ar:IS_AGENT_OF]-(a:Advisor)-[r:MEMBER_OF]->(t:Team) WHERE t.distChannelCode='CAN' and ar.statusCode='A' RETURN count(distinct a) as agency",{}) yield value
  WITH value as v1
  CALL apoc.cypher.run("MATCH (e:Entity)<-[ar:IS_AGENT_OF]-(a:Advisor)-[r:MEMBER_OF]->(t:Team) WHERE t.distChannelCode='BRO' and ar.statusCode='A' RETURN count(distinct a) as broker",{}) yield value
  WITH v1, value as v2
  CALL apoc.cypher.run("MATCH (e:Entity)<-[ar:IS_AGENT_OF]-(a:Advisor) RETURN count(distinct a) as all",{}) yield value
  WITH v1,v2,value as v3
  return {agency: v1.agency ,broker: v2.broker, all: v3.all }`
  return session.run(query).then(result => {return result.records.map(record => {
   return {
        agency: record._fields[0].agency.toNumber(),
        broker: record._fields[0].broker.toNumber(),
        totalActive: record._fields[0].all.toNumber()
      }
   })
 })
}
exports.createAdvisorWithManager = (params) => {
  let session = driver.session()
  let managerHash = params.managerId
  let queryParams = buildBasicInfoProps(params)
  let jampackedQuery = `
  CALL apoc.cypher.run('MATCH (n:Advisor) RETURN count(n) as count',{}) YIELD value
  WITH LEFT('00000',5-SIZE(toString(value.count)))+toString(value.count) as agentId
  MATCH (manager:Advisor)-[r:MEMBER_OF]->(team:Team)
  WHERE manager.hash = '${managerHash}'
  CREATE (basicInfo:BasicInfo $props)
  CREATE (newAdvisor:Advisor {hash: "AG"+agentId)
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

exports.createAdvisor = (params) => {
  let session = driver.session()
  let queryParams = buildBasicInfoProps(params)
  let jampackedQuery = `
  CALL apoc.cypher.run('MATCH (n:Advisor) RETURN count(n) as count',{}) YIELD value
  WITH LEFT('00000',5-SIZE(toString(value.count)))+toString(value.count) as agentId
  CREATE (basicInfo:BasicInfo $props)
  CREATE (advisor: Advisor {hash: "AG"+agentId})<-[:IS_BASIC_INFO_OF]-(basicInfo)
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
}

exports.retrieveHierarchyUpwards = (hash) => {
  let session = driver.session()
  let jampackedQuery = 
  `
  MATCH (n:Advisor {hash: '${hash}'})-[r:REPORTS_TO]->(o:Advisor)
  MATCH (b:BasicInfo) -[:IS_BASIC_INFO_OF] ->(n)
  MATCH (b1: BasicInfo) -[:IS_BASIC_INFO_OF] ->(o)
  MATCH (o) -[:HAS_EMAIL] -> (c:ContactInfo)
  RETURN r as level, o as advisor, b1 as advisorInfo, c as email
  ORDER by r.level
  `
  return session.run(jampackedQuery)
  .then(result => { return result.records.map(record => {
    advisor = record.get('advisor').properties
    advisor['info'] = [record.get('advisorInfo').properties] 
    console.log(record)
    return {
      'level': record.get("level").properties,
      'advisor': advisor
    }
    })
  })
}

exports.retrieveHierarchyDownwards = (hash) => {
  let session = driver.session()
  let jampackedQuery = 
  `
  MATCH (n:Advisor {hash: '${hash}'})<-[r:REPORTS_TO]-(o:Advisor)
  MATCH (b:BasicInfo) -[:IS_BASIC_INFO_OF] ->(n)
  MATCH (b1: BasicInfo) -[:IS_BASIC_INFO_OF] ->(o)
  MATCH (o) -[:HAS_EMAIL] -> (c:ContactInfo)
  RETURN r as level, o as advisor, b1 as advisorInfo, c as email
  ORDER by r.level
  `
  return session.run(jampackedQuery)
  .then(result => { return result.records.map(record => {
    advisor = record.get('advisor').properties
    advisor['info'] = [record.get('advisorInfo').properties] 
    return {
      'level': record.get("level").properties,
      'advisor': advisor
    }
    })
  })
}