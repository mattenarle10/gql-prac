import { InMemoryTodoRepository, type TodoRepository } from '../modules/todo/repository.js'

export interface AppRepositories {
  todo: TodoRepository
}

export interface AppContext {
  requestId: string
  repos: AppRepositories
}

function createRepositories(): AppRepositories {
  return {
    todo: new InMemoryTodoRepository(),
  }
}

const repositories = createRepositories()

export function createContext(): AppContext {
  return {
    requestId: Math.random().toString(36).slice(2),
    repos: repositories,
  }
}


