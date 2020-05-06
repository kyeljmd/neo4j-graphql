const fs = require( "fs");
const path = require("path")
const {retrieveHierarchyUpwards, retrieveHierarchyDownwards,
  createAdvisor, createAdvisorWithManager, retrieveDistributionChannel,driver} = require("../db/dao")
let typeDefs = fs.readFileSync(process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")).toString("utf-8");

typeDefs = `type BasicInfo {
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
  unit: [Team] @relation(name: "BELONGS_TO_BRANCH", direction: "OUT")
  members: [Team] @relation(name: "BRANCH_HAS_TEAM", direction: "OUT")
  advisors: [Advisor] @relation(name: "MEMBER_OF", direction: "OUT")
  entity: [Entity] @relation(name: "ENTITY_HAS_BRANCH", direction: "IN")
  contracts: [Contract] @relation(name: "IS_CONTRACT_ASSIGNED_TEAM", direction: "IN")
}


type Entity {
  name: String
  code: String
  createdDate: String
  hash: ID!
  effectiveDate: String
  branches: [Team] @relation(name: "ENTITY_HAS_BRANCH", direction: "OUT")
  contracts: [Contract] @relation(name: "IS_CONTRACT_ISSUED_BY", direction: "IN")
  recruits: [Entity] @relation(name: "IS_RECRUIT_OF", direction: "IN")
  reportRecruitments: [Report] @relation(name: "IS_REPORT_RECRUITMENT_OF", direction: "IN")
  mobileNumber: [ContactInfo] @relation(name: "HAS_MOBILE", direction: "IN")
  homeNumber: [ContactInfo] @relation(name: "HAS_PHONE", direction: "IN")
}

type Recruit {
  hash: ID!
  caption: String
  classificationCode: String
  number: String
  info: [BasicInfo] @relation(name: "IS_BASIC_INFO_OF", direction: "IN")
  contactNumber: [ContactInfo] @relation(name: "HAS_MOBILE", direction: "OUT")
  email: [ContactInfo] @relation(name: "HAS_EMAIL", direction: "OUT")
  address: [Address] @relation(name: "LIVES_IN", direction: "OUT")
  entity: [Entity] @relation(name: "IS_RECRUIT_OF", direction: "OUT")
  recruitmentInfo: [Task] @relation(name: "IS_TASK_TO", direction: "IN")
}

type Identification {
  type: String
  value: String
  hash: ID!
}

type ContactInfo {
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
  contract: [ContractAdvisor]
  info: [BasicInfo] @relation(name: "IS_BASIC_INFO_OF", direction: "IN")
  manager: [Advisor] @relation(name: "REPORTS_TO", direction: "OUT")
  manages: [Advisor] @relation(name: "MANAGES", direction: "OUT")
  team: [Team] @relation(name: "MEMBER_OF", direction: "OUT")
  entity: [Entity] @relation(name: "IS_AGENT_OF", direction: "OUT")
  tin: [Identification] @relation(name: "HAS_TIN", direction: "OUT")
  sss: [Identification] @relation(name: "HAS_SSS", direction: "OUT")  
  mobileNumber: [ContactInfo] @relation(name: "HAS_MOBILE", direction: "OUT")
  homeNumber: [ContactInfo] @relation(name: "HAS_PHONE", direction: "OUT")
  email: [ContactInfo] @relation(name: "HAS_EMAIL", direction: "OUT")
  address: [Address] @relation(name: "LIVES_IN", direction: "OUT")
  hierarchyUpwards: [HierarchyTree] @neo4j_ignore
  hierarchyDownwards: [HierarchyTree] @neo4j_ignore
}

type Task @additionalLabels(labels: ["Recruitment"]) {
  hash: ID!
  caption: String
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
  classificationCode: String
  disbursementType: String
  caption: String
  advisorName: String
  currencyCode: String
  manager: [Advisor] @relation(name:"IS_CONTRACT_ASSIGNED_IMMEDIATE_MANAGER", direction: "OUT")
  entity: [Entity] @relation(name: "IS_CONTRACT_ISSUED_BY", direction: "OUT")
  advisor: [ContractAdvisor]
}


type ContractAdvisor @relation(name: "IS_CONTRACT_OF"){
    to: [Advisor]
    classificationCode:String 
    classificationEffectiveDate: String
    advisorStatusCode:String
    advisorStatusEffectiveDate:String
    from: [Contract]
}

type Calendar {
  hash:ID!
  caption:String
  cutoffYear: String
  cutOffParams: [Calendar] @relation(name: "IS_REPORT_CUTOFFPARAMS_FOR", direction: "OUT")
}

type Report @additionalLabels(labels: ["RecruitmentTarget"]) {
  cutoffYear: String
  hash:ID!
  targetAdvisors: String
  targetEffectiveDate:String
  entity: [Entity] @relation(name: "IS_REPORT_RECRUITMENT_OF", direction: "OUT")
}

type Level {
  level: Int
}

type HierarchyTree {
  level: Level!
  advisor:Advisor!
}

type DistributionChannel{
  agency: String
  broker: String
  totalActive: String
}

type Query{
  distributionChannel:[DistributionChannel]
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
}`

exports.resolvers = {
  // root entry point to GraphQL service
  Query: {
      distributionChannel(obj,params,ctx) {
      return retrieveDistributionChannel()
    }
  },
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