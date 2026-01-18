import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL
    const dbUrlStart = process.env.DATABASE_URL?.substring(0, 30)
    
    // Try to connect
    await prisma.$connect()
    
    // Check if Admin table exists
    const adminCount = await prisma.admin.count()
    
    // Check all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    return NextResponse.json({
      success: true,
      hasDbUrl,
      dbUrlStart,
      adminCount,
      tables,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      errorName: error.name,
      stack: error.stack,
    }, { status: 500 })
  }
}
