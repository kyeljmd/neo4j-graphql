const typeDefs = `
type Employee {
    id: ID!
    name: String
    code: String
    post: String
    manager(first: Int = 3, offset: Int = 0): [Employee] @cypher(statement: "MATCH (this)-[:REPORTS_TO]->(b:Employee) b RETURN b")
}
`;

exports.typeDefs = typeDefs;