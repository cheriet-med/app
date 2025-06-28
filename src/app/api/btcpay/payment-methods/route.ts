import { NextResponse } from 'next/server';
import { btcPayService } from '@/lib/btcpay';
import type { APIResponse, PaymentMethod } from '@/types/btcpay';

export async function GET(): Promise<NextResponse<APIResponse<PaymentMethod[]>>> {
  try {
    const paymentMethods = await btcPayService.getPaymentMethods();
    return NextResponse.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payment methods',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}