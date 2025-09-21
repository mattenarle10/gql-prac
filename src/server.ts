import { createYoga, createSchema } from 'graphql-yoga'
import http from 'node:http'
import { z } from 'zod'

interface Context {
  requestId: string
}

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const todos: Todo[] = []

function generateId(): string {
  return Math.random().toString(36).slice(2)
}

const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
})

const updateTodoInputBase = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
})

const updateTodoSchema = updateTodoInputBase.refine(
  (v) => typeof v.title !== 'undefined' || typeof v.completed !== 'undefined',
  { message: 'Provide title or completed to update' }
)

const typeDefs = /* GraphQL */ `
  scalar Date

  type Query {
    hello(name: String = "World"): String!
    now: String!
    random: Float!
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  type Mutation {
    echo(text: String!): String!
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTodoInput {
    title: String!
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    completed: Boolean
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
    todos: () => todos,
    todo: (_: unknown, args: { id: string }) => todos.find((t) => t.id === args.id) ?? null,
  },
  Mutation: {
    echo: (_: unknown, args: { text: string }) => args.text,
    createTodo: (_: unknown, args: { input: { title: string } }) => {
      const parsed = createTodoSchema.parse(args.input)
      const now = new Date().toISOString()
      const todo: Todo = {
        id: generateId(),
        title: parsed.title,
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      todos.unshift(todo)
      return todo
    },
    updateTodo: (_: unknown, args: { input: { id: string; title?: string; completed?: boolean } }) => {
      const parsed = updateTodoSchema.parse(args.input)
      const idx = todos.findIndex((t) => t.id === parsed.id)
      if (idx === -1) return null
      const current = todos[idx]
      if (!current) return null
      const updated: Todo = {
        id: current.id,
        title: typeof parsed.title !== 'undefined' ? parsed.title : current.title,
        completed: typeof parsed.completed !== 'undefined' ? parsed.completed : current.completed,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      }
      todos[idx] = updated
      return updated
    },
    deleteTodo: (_: unknown, args: { id: string }) => {
      const idx = todos.findIndex((t) => t.id === args.id)
      if (idx === -1) return false
      todos.splice(idx, 1)
      return true
    },
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
