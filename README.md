# gql-prac

A tiny TypeScript GraphQL server using GraphQL Yoga for local practice. Includes GraphiQL and an in-memory Todo CRUD.

## Project structure

```
src/
  app/
    context.ts         # Builds typed AppContext with repositories
    schema.ts          # Composes module typeDefs/resolvers
  modules/
    health/
      schema.ts        # now, random
    todo/
      repository.ts    # InMemory repository + Zod validation
      schema.ts        # GraphQL types and resolvers using the repo
  server.ts            # Wires Yoga server with schema & context
scripts/
  bench.cjs            # Simple speed test against the API
```

## Quick start

```bash
npm i
npm run dev
# open http://localhost:4000/graphql
```

## Learning path (hands-on tutorial)

1) Explore the schema in GraphiQL
- Open http://localhost:4000/graphql
- Run:
```graphql
query {
  now
  random
  todos { id title completed }
}
```

2) Create, update, delete a Todo
```graphql
mutation {
  createTodo(input: { title: "Learn GraphQL" }) {
    id
    title
    completed
  }
}
```
Copy the returned `id` and run:
```graphql
mutation($id: ID!) {
  updateTodo(input: { id: $id, completed: true }) {
    id
    title
    completed
  }
}
```
Variables:
```json
{ "id": "PASTE_ID_HERE" }
```
Then delete:
```graphql
mutation($id: ID!) {
  deleteTodo(id: $id)
}
```

3) Understand the layering
- Repository (data + validation): `src/modules/todo/repository.ts`
  - Validates inputs with Zod.
  - Provides `list/getById/create/update/delete`.
- Resolvers (API): `src/modules/todo/schema.ts`
  - Thin layer that calls the repository via typed `AppContext`.
- Composition: `src/app/schema.ts`
  - Adds a base schema and merges module typeDefs/resolvers.
- Context: `src/app/context.ts`
  - Creates long-lived repositories and attaches them to each request as `ctx.repos`.

4) Extend the domain (exercise)
- Add a `description: String` to `Todo`.
- Update Zod schemas to accept `description`.
- Add it to `create/update` inputs and return fields.
- Verify via GraphiQL.

5) Speed test
```bash
npm run bench
```
It will print total time for 200 concurrent queries and an average per request.

## Scripts
- dev: Start in watch mode with tsx
- build: Compile TypeScript to dist/
- start: Run compiled server
- bench: Simple concurrency test

## Notes
- ES modules with Node >=18: imports use explicit `.js` endings for internal files.
- Strict TypeScript with Zod for runtime validation.
- Replace the in-memory repository with a database later (e.g., Prisma + SQLite/Postgres).
