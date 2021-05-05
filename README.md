Car object

name: String!
manufacturer: Manufacturers! # use an enum!

Valid Mutation Queries

addCar(name: String!, manufacturer: String!): Car!
updateCar(id: Int!, name: String, manufacturer: Manufacturers): Car!
deleteCar(id: Int!): Car!