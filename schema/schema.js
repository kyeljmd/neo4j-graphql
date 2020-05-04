const{ neo4jgraphql } = require('neo4j-graphql-js');
const { GraphQLObjectType } = require('graphql')
const neo4j  = require('neo4j-driver');

const typeDefs = `
type BasicInfo {
  hash: ID!
  lastName: String
  nickName: String
  companyName: String
  birthDate: String
  titleCode: String
  birthPlace: String
  firstName: String
  number: String
  nationalityCode: String
  genderCode: String
  classificationCode: String
  civilStatusCode: String
  profileTypeCode: String
  middleName: String
  effectiveDate: String
  suffixCode: String
  fullName: String
}

type Team {
  hash: ID!
  costCenterCode: String
  costCenterTeamFlag: String
  code: String
  cityCode: String
  provinceCode: String
  postalCode: String
  contactInfoTxt: String
  distChannelCode: String
  typeCode: String
  createdDate: String
  streetAddress: String
  countryCode: String
  name: String
  longCode: String
  effectiveDate: String
  remarks: String
  longName: String
  branch: [Team] @relation(name: "BELONGS_TO_BRANCH", direction: "OUT")
  members: [Team] @relation(name: "BRANCH_HAS_TEAM", direction: "OUT")
  advisors: [Advisor] @relation(name: "MEMBER_OF", direction: "OUT")
  entity: [Entity] @relation(name: "ENTITY_HAS_BRANCH", direction: "IN")
}


type Entity {
  name: String
  code: String
  createdDate: String
  hash: ID!
  effectiveDate: String
  branches: [Team] @relation(name: "ENTITY_HAS_BRANCH", direction: "OUT")
}

type Recruit {
  hash: ID!
  lastName: String
  nickName: String
  companyName: String
  birthDate: String
  titleCode: String
  number: String
  firstName: String
  birthPlace: String
  nationalityCode: String
  genderCode: String
  civilStatusCode: String
  profileTypeCode: String
  middleName: String
  suffixCode: String
  contactNumber: [Contact] @relation(name: "HAS_MOBILE", direction: "OUT")
  email: [Contact] @relation(name: "HAS_EMAIL", direction: "OUT")
  address: [Address] @relation(name: "LIVES_IN", direction: "OUT")
}

type Identification {
  type: String
  value: String
}

type Contact {
  type: String
  value: String
}

type Address{
  addressTypeCode:  String
  streetAddress:  String
  cityCode: String
  provinceCode: String
  countryCode:  String
  postalCode: String
  mailingAddressFlag: String
}

type Workflow {
  name: String
  code: String
  tasks: [Task] @relation(name: "HAS_TASK", direction: "OUT")
}

type Advisor {
  hash: ID!
  caption: String
  classificationCode: String
  number: String
  contract: [Contract] @relation(name: "IS_CONTRACT_OF", direction: "IN")
  info: [BasicInfo] @relation(name: "IS_BASIC_INFO_OF", direction: "IN")
  manager: [Advisor] @relation(name: "REPORTS_TO", direction: "OUT")
  manages: [Advisor] @relation(name: "MANAGES", direction: "OUT")
  team: [Team] @relation(name: "MEMBER_OF", direction: "OUT")
  entity: [Entity] @relation(name: "IS_AGENT_OF", direction: "OUT")
  tin: [Identification] @relation(name: "HAS_TIN", direction: "OUT")
  sss: [Identification] @relation(name: "HAS_SSS", direction: "OUT")  
  contactNumber: [Contact] @relation(name: "HAS_MOBILE", direction: "OUT")
  email: [Contact] @relation(name: "HAS_EMAIL", direction: "OUT")
  address: [Address] @relation(name: "LIVES_IN", direction: "OUT")
  hierarchyUpwards: [HierarchyTree] @neo4j_ignore
  hierarchyDownwards: [HierarchyTree] @neo4j_ignore
}

type Task {
  taskType: String
  updatedBy: String
  createdDate: String
  documents: String
  createdBy: String
  assignee: String
  updatedDate: String
  status: String
  toRecruit: [Recruit] @relation(name: "IS_TASK_TO_RECRUIT", direction: "OUT")
  workflow: [Workflow] @relation(name: "IS_TASK_OF_WORKFLOW", direction: "OUT")
}

type Contract {
  hash: ID!
  costCenterCode: String
  contractDate: String
  disbursementType: String
  caption: String
  advisorName: String
  currencyCode: String
  manager: [Advisor] @relation(name:"IS_CONTRACT_ASSIGNED_IMMEDIATE_MANAGER", direction: "OUT")
}

type Level {
  level: Int
}

type HierarchyTree {
  level: Level!
  advisor:Advisor!
}

type Mutation {
  createAdvisorWithManager(lastName: String,
    nickName: String,
    companyName: String,
    birthDate: String,
    titleCode: String,
    birthPlace: String,
    firstName: String,
    number: String,
    nationalityCode: String,
    genderCode: String,
    classificationCode: String,
    civilStatusCode: String,
    profileTypeCode: String,
    middleName: String,
    effectiveDate: String,
    managerId: String,
    suffixCode: String):[Advisor]
  
    createAdvisorNoManager(lastName: String,
      nickName: String,
      companyName: String,
      birthDate: String,
      titleCode: String,
      birthPlace: String,
      firstName: String,
      number: String,
      nationalityCode: String,
      genderCode: String,
      classificationCode: String,
      civilStatusCode: String,
      profileTypeCode: String,
      middleName: String,
      effectiveDate: String,
      suffixCode: String):[Advisor]  
}
`;


const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '123qwe')
);

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
      }
    } 

    let email  = params.email || ""
    let sss = params.sss || ""
    let tin = params.tin || ""
    let code = "AGENT003"
    console.log("CUSTER")
    //make this auto generated
    let jampackedQuery = `
    CREATE (basicInfo:BasicInfo $props)
    CREATE (advisor: Advisor {hash: '${code}'})<-[:IS_BASIC_INFO_OF]-(basicInfo)
    return basicInfo, advisor
    `
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
      CREATE (newAdvisor:Advisor { hash: ${advisorHash}})
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
      let session = ctx.driver.session()
      let jampackedQuery = 
      `
      MATCH (n:Advisor {hash: '${parent.hash}'})-[r:REPORTS_TO]->(o:Advisor)
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
        advisor['info'] = [record.get('advisorInfo').properties] 
        return {
          'level': record.get("level").properties,
          'advisor': advisor
        }
        })
      })
    },
    hierarchyDownwards(parent, _, ctx) {
      let session = ctx.driver.session()
      let jampackedQuery = 
      `
      MATCH (n:Advisor {hash: '${parent.hash}'})<-[r:REPORTS_TO]-(o:Advisor)
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
        advisor['info'] = [record.get('advisorInfo').properties] 
        return {
          'level': record.get("level").properties,
          'advisor': advisor
        }
        })
      })
    }
  }
};

exports.typeDefs = typeDefs;
exports.driver = driver;