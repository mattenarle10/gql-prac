import { createYoga, createSchema } from 'graphql-yoga'
import http from 'node:http'

interface Context {
  requestId: string
}

const typeDefs = /* GraphQL */ `
  scalar Date

  type Query {
    hello(name: String = "World"): String!
    now: String!
    random: Float!
  }

  type Mutation {
    echo(text: String!): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: unknown, args: { name?: string }, ctx: Context) => {
      const who = args.name ?? 'World'
      return `Hello, ${who}! (req ${ctx.requestId})`
    },
    now: () => new Date().toISOString(),
    random: () => Math.random(),
  },
  Mutation: {
    echo: (_: unknown, args: { text: string }) => args.text,
  },
}

function createContext(): Context {
  return { requestId: Math.random().toString(36).slice(2) }
}

const yoga = createYoga<Context>({
  schema: createSchema({ typeDefs, resolvers }),
  context: createContext,
  graphqlEndpoint: '/graphql',
  landingPage: true,
})

const server = http.createServer(yoga)
const port = Number(process.env.PORT ?? 4000)
server.listen(port, () => {
  console.log(`🚀 GraphQL server ready at http://localhost:${port}${yoga.graphqlEndpoint}`)
})
