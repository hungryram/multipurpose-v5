import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital:', {
        name: body.name,
        value: Math.round(body.value),
        rating: body.rating,
      })
    }

    // In production, send to analytics service (Vercel Analytics, Google Analytics, etc.)
    // Example: await analytics.track('web-vital', body)

    return NextResponse.json({received: true})
  } catch (error) {
    return NextResponse.json({error: 'Failed to log vitals'}, {status: 500})
  }
}
