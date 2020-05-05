const neo4j  = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '123qwe')
);
  
exports.createAdvisorWithManager = (params) => {
  
}

exports.createAdvisor = (params) => {

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
  let jampackedQuery = 
  `
  MATCH (n:Advisor {hash: '${hash}'})<-[r:REPORTS_TO]-(o:Advisor)
  MATCH (b:BasicInfo) -[:IS_BASIC_INFO_OF] ->(n)
  MATCH (b1: BasicInfo) -[:IS_BASIC_INFO_OF] ->(o)
  MATCH (o) -[:HAS_EMAIL] -> (c:ContactInfo)
  RETURN r as level, o as advisor, b1 as advisorInfo, c as email
  ORDER by r.level
  `
  let query = `MATCH (n:Advisor {hash: '${parent.hash}'})-[r:REPORTS_TO]->(o:Advisor) 
  RETURN r as level, o as advisor LIMIT 25`;
  return session.run(jampackedQuery)
  .then(result => { return result.records.map(record => {
    advisor = record.get('advisor').properties
    console.log(query)
    advisor['info'] = [record.get('advisorInfo').properties] 
    return {
      'level': record.get("level").properties,
      'advisor': advisor
    }
    })
  })
}