import { NextResponse } from 'next/server';
import { btcPayService } from '@/lib/btcpay';
import type { APIResponse, BTCPayStore } from '@/types/btcpay';

export async function GET(): Promise<NextResponse<APIResponse<BTCPayStore>>> {
  try {
    const store = await btcPayService.getStore();
    return NextResponse.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Store fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch store info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}