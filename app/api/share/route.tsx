import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Share API called with data:', data);

    // Format the results text
    const resultsText = data.results
      .map((result: any) => `${result.language}: ${result.text} (${(result.score).toFixed(1)}/10)`)
      .join('\n');

    // Create the share text
    const shareText = `💭 BabelLM Analysis\n\n❓ Question: ${data.question}\n\n${resultsText}\n\n🌐 Try it at babellm.ai`;
    
    return NextResponse.json({ 
      success: true,
      shareText
    });
  } catch (error) {
    console.error('Error in share API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process share text' 
    }, { status: 500 });
  }
} 