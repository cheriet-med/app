import { NextRequest, NextResponse } from 'next/server';
import { btcPayService } from '@/lib/btcpay';
import type { CreateInvoiceRequest, APIResponse, BTCPayInvoice, GetInvoicesOptions } from '@/types/btcpay';

interface CreateInvoiceBody extends Omit<CreateInvoiceRequest, 'amount'> {
  amount: number;
  customerEmail?: string;
  customerName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<BTCPayInvoice>>> {
  try {
    const body: CreateInvoiceBody = await request.json();
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid amount is required' 
        },
        { status: 400 }
      );
    }
    
    const invoiceData: CreateInvoiceRequest = {
      amount: body.amount,
      currency: body.currency || 'USD',
      orderId: body.orderId || `order-${Date.now()}`,
      itemDesc: body.itemDesc || 'Payment',
      notificationURL: `${process.env.NEXT_PUBLIC_HOME}/api/webhooks/btcpay`,
      redirectURL: `${process.env.NEXT_PUBLIC_HOME}/en/account/orders`,
      metadata: {
        ...body.metadata,
        customerEmail: body.customerEmail,
        customerName: body.customerName,
      },
      checkout: body.checkout,
    };

    const invoice = await btcPayService.createInvoice(invoiceData);
    
    return NextResponse.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<BTCPayInvoice | BTCPayInvoice[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');
    const status = searchParams.getAll('status') as any[];
    const orderId = searchParams.get('orderId');
    const itemCode = searchParams.get('itemCode');
    const take = searchParams.get('take');
    const skip = searchParams.get('skip');
    
    if (invoiceId) {
      const invoice = await btcPayService.getInvoice(invoiceId);
      return NextResponse.json({
        success: true,
        data: invoice
      });
    } else {
      const options: GetInvoicesOptions = {};
      if (status.length > 0) options.status = status;
      if (orderId) options.orderId = orderId;
      if (itemCode) options.itemCode = itemCode;
      if (take) options.take = parseInt(take);
      if (skip) options.skip = parseInt(skip);
      
      const invoices = await btcPayService.getInvoices(options);
      return NextResponse.json({
        success: true,
        data: invoices
      });
    }
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch invoice(s)',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<APIResponse<string>>> {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');
    
    if (!invoiceId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invoice ID is required' 
        },
        { status: 400 }
      );
    }

    await btcPayService.archiveInvoice(invoiceId);
    
    return NextResponse.json({
      success: true,
      data: 'Invoice archived successfully'
    });
  } catch (error) {
    console.error('Invoice archive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to archive invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}