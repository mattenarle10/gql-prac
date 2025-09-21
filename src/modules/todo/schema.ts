import type { AppContext } from '../../app/context.js'

export const typeDefs = /* GraphQL */ `
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTodoInput { title: String! }

  input UpdateTodoInput { id: ID!, title: String, completed: Boolean }

  extend type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean!
  }
`

export const resolvers = {
  Query: {
    todos: async (_: unknown, __: unknown, ctx: AppContext) => ctx.repos.todo.list(),
    todo: async (_: unknown, args: { id: string }, ctx: AppContext) => ctx.repos.todo.getById(args.id),
  },
  Mutation: {
    createTodo: async (_: unknown, args: { input: { title: string } }, ctx: AppContext) => ctx.repos.todo.create(args.input),
    updateTodo: async (
      _: unknown,
      args: { input: { id: string; title?: string; completed?: boolean } },
      ctx: AppContext
    ) => ctx.repos.todo.update(args.input),
    deleteTodo: async (_: unknown, args: { id: string }, ctx: AppContext) => ctx.repos.todo.delete(args.id),
  },
}


