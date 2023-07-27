export interface Log {
  type: 'error' | 'warning' | 'info',
  from: 'CLIENT' | 'SERVER',
  createdAt: Date,
  log: unknown | {
    [key: string]: string|Date
  }
}

export const logTypes: ReadonlyArray<Log['type']> = [ 'error', 'warning' , 'info' ]
export const logOrigins: ReadonlyArray<Log['from']> = [ 'CLIENT', 'SERVER' ]