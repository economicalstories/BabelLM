/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';

interface ShareCardData {
  question: string;
  results: Array<{
    flagCode: string;
    text: string;
    score: number;
    languageCode: string;
  }>;
}

export class ShareCardRenderer {
  public async render(data: ShareCardData): Promise<Response> {
    try {
      console.log('Rendering share card with data:', JSON.stringify(data));

      // Load Inter font
      const interRegular = await fetch(
        new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2')
      ).then((res) => res.arrayBuffer());

      const interBold = await fetch(
        new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2')
      ).then((res) => res.arrayBuffer());

      return new ImageResponse(
        (
          <div
            style={{
              width: '1200px',
              height: '630px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
              backgroundImage: 'radial-gradient(circle at 10px 10px, #F1F5F9 1px, transparent 0)',
              backgroundSize: '20px 20px',
              padding: '48px',
              fontFamily: 'Inter',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold',
                color: '#3B82F6',
                letterSpacing: '-0.05em',
                fontFamily: 'Inter',
              }}>
                BabelLM
              </div>
              <div style={{ fontSize: '20px', color: '#64748B' }}>
                Discover the language behind the text
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              maxWidth: '800px',
              width: '100%'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  color: '#1E293B', 
                  marginBottom: '16px',
                  lineHeight: '1.4',
                  fontFamily: 'Inter',
                }}>
                  {data.question}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%'
              }}>
                {data.results.map((result, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '36px',
                      background: '#E2E8F0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#64748B'
                    }}>
                      {result.flagCode.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '18px', 
                        color: '#334155', 
                        marginBottom: '8px',
                        fontFamily: 'Inter',
                        lineHeight: '1.4',
                      }}>
                        {result.text}
                      </div>
                      <div style={{
                        width: `${result.score * 100}%`,
                        height: '4px',
                        background: '#3B82F6',
                        borderRadius: '2px',
                      }} />
                    </div>
                    <div style={{ fontSize: '16px', color: '#64748B' }}>
                      {Math.round(result.score * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '16px', color: '#64748B' }}>
              Try it yourself at babellm.ai
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'Inter',
              data: interRegular,
              weight: 400,
              style: 'normal',
            },
            {
              name: 'Inter',
              data: interBold,
              weight: 700,
              style: 'normal',
            },
          ],
        }
      );
    } catch (error) {
      console.error('Error generating share card:', error);
      throw error;
    }
  }
} 