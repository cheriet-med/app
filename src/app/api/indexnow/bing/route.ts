// app/api/indexnow/bing/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface IndexNowRequest {
  urls: string | string[];
}

interface IndexNowResponse {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    status: number;
    success: boolean;
    statusText: string;
    timestamp: string;
    urlCount: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: IndexNowRequest = await request.json();
    const { urls } = body;
    
    if (!urls || (Array.isArray(urls) && urls.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'URLs are required' },
        { status: 400 }
      );
    }

    const indexNowKey = process.env.INDEXNOW_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    if (!indexNowKey || !siteUrl) {
      return NextResponse.json(
        { success: false, error: 'IndexNow configuration missing' },
        { status: 500 }
      );
    }

    const keyLocation = `${siteUrl}/${indexNowKey}.txt`;
    const urlList = Array.isArray(urls) ? urls : [urls];

    const payload: IndexNowResponse = {
      host: new URL(siteUrl).hostname,
      key: indexNowKey,
      keyLocation: keyLocation,
      urlList: urlList,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = {
      status: response.status,
      success: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
      urlCount: urlList.length,
    };

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: `Successfully submitted ${urlList.length} URL(s) to Bing IndexNow`,
        data: responseData,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Bing IndexNow API returned ${response.status}: ${response.statusText}`,
        data: responseData,
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Bing IndexNow error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit to Bing IndexNow', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}