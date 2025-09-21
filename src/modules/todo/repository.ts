import { z } from 'zod'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export const createTodoInput = z.object({
  title: z.string().min(1).max(200),
})

export const updateTodoInput = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((v) => typeof v.title !== 'undefined' || typeof v.completed !== 'undefined', {
    message: 'Provide title or completed to update',
  })

export interface TodoRepository {
  list(): Promise<Todo[]>
  getById(id: string): Promise<Todo | null>
  create(input: z.infer<typeof createTodoInput>): Promise<Todo>
  update(input: z.infer<typeof updateTodoInput>): Promise<Todo | null>
  delete(id: string): Promise<boolean>
}

export class InMemoryTodoRepository implements TodoRepository {
  private items: Todo[] = []

  private generateId(): string {
    return Math.random().toString(36).slice(2)
  }

  async list(): Promise<Todo[]> { return this.items }

  async getById(id: string): Promise<Todo | null> {
    return this.items.find((t) => t.id === id) ?? null
  }

  async create(input: z.infer<typeof createTodoInput>): Promise<Todo> {
    const parsed = createTodoInput.parse(input)
    const now = new Date().toISOString()
    const todo: Todo = { id: this.generateId(), title: parsed.title, completed: false, createdAt: now, updatedAt: now }
    this.items.unshift(todo)
    return todo
  }

  async update(input: z.infer<typeof updateTodoInput>): Promise<Todo | null> {
    const parsed = updateTodoInput.parse(input)
    const idx = this.items.findIndex((t) => t.id === parsed.id)
    if (idx === -1) return null
    const current = this.items[idx]
    const updated: Todo = {
      id: current.id,
      title: typeof parsed.title !== 'undefined' ? parsed.title : current.title,
      completed: typeof parsed.completed !== 'undefined' ? parsed.completed : current.completed,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }
    this.items[idx] = updated
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.items.findIndex((t) => t.id === id)
    if (idx === -1) return false
    this.items.splice(idx, 1)
    return true
  }
}


