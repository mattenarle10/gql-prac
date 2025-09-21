import { createYoga } from 'graphql-yoga'
import http from 'node:http'
import { schema } from './app/schema.js'
import { createContext, type AppContext } from './app/context.js'

const yoga = createYoga<AppContext>({
  schema,
  context: createContext,
  graphqlEndpoint: '/graphql',
  landingPage: true,
})

const server = http.createServer(yoga)
const port = Number(process.env.PORT ?? 4000)
server.listen(port, () => {
  console.log(`🚀 GraphQL server ready at http://localhost:${port}${yoga.graphqlEndpoint}`)
})
