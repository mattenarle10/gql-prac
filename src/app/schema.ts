import { createSchema } from 'graphql-yoga'
import { typeDefs as todoTypeDefs, resolvers as todoResolvers } from '../modules/todo/schema.js'
import { typeDefs as healthTypeDefs, resolvers as healthResolvers } from '../modules/health/schema.js'

// Base schema to allow module extensions
const baseTypeDefs = /* GraphQL */ `
  scalar Date
  type Query { _empty: String }
  type Mutation { _empty: String }
`

export const schema = createSchema({
  typeDefs: [baseTypeDefs, healthTypeDefs, todoTypeDefs],
  resolvers: [healthResolvers, todoResolvers] as any,
})


