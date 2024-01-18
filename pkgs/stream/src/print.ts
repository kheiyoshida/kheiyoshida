/* eslint-disable no-console */

import TableLayout from 'table-layout'

type LogItem = Record<string, unknown>
type LogData = LogItem[]

export function printLog(log: LogData) {
  console.clear()
  console.log(convertTable(log))
}

export function convertTable(log: LogData): string {
  const headers = Object.fromEntries(Object.keys(log[0]).map(k => [k,k]))
  const table = new TableLayout([headers, ...log])
  return table.toString()
}
