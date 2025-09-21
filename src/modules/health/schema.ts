export const typeDefs = /* GraphQL */ `
  extend type Query { now: String!, random: Float! }
`

export const resolvers = {
  Query: {
    now: () => new Date().toISOString(),
    random: () => Math.random(),
  },
}


