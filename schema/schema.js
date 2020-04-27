const{ neo4jgraphql } = require('neo4j-graphql-js');

const typeDefs = `
type Employee {
    name: String
    code: ID!
    post: String
    manager: [Employee] @relation(name: "REPORTS_TO", direction: "OUT")
    manages: [Employee] @relation(name: "REPORTS_TO", direction: "IN")
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

type Task {
  taskType:  String
  updatedBy: String
  createdDate: String
  createdBy: String
  documents: String
  assignee: String
  updatedDate: String
  status: String
}

type Workflow {
  name: String
  code: String
}
`;


exports.resolvers = {
  // root entry point to GraphQL service
  Query: {
    Employee(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    }
  }
};

exports.typeDefs = typeDefs;