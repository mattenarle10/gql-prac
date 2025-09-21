# gql-prac

A tiny TypeScript GraphQL server using GraphQL Yoga for local practice. Includes GraphiQL.

## Scripts
- dev: Start in watch mode with tsx
- build: Compile TypeScript to dist/
- start: Run compiled server

## Run
```bash
npm run dev
# open http://localhost:4000/graphql
```

## Example Queries
```graphql
query {
  hello
  now
  random
}

mutation {
  echo(text: "hi")
}
```
