import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'celebrities.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const users = JSON.parse(fileContents)
  return NextResponse.json(users)
}
