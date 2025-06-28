import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';



export async function POST(request: NextRequest) {
  
  try {
  
    console.log('Webhook received');
    
    // Read the raw body as text first for signature verification
    const body = await request.text();
    console.log('Raw body:', body);
    
    // Parse the JSON from the body string
    const payload = JSON.parse(body);
    console.log('Webhook payload:', payload);
    
    // Get signature from headers
    const signature = request.headers.get('btcpay-sig');
    console.log('Received signature:', signature);
    
    // Verify webhook signature
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      const expectedSigWithPrefix = `sha256=${expectedSignature}`;
      console.log('Expected signature:', expectedSigWithPrefix);
      
      if (expectedSigWithPrefix !== signature) {
        console.log('Signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('Signature verified successfully ✅');
    } else {
      console.log('No webhook secret or signature provided');
    }


    if (payload.type === 'InvoiceSettled' || payload.type === 'InvoiceProcessing') {
      const transactionIdToFind = payload.invoiceId;

      const orderEmail = {
      name: "new order",
      email: "cheriet.imc@gmail.com",
      OrderID: payload.id,
      language: "l",
      date_time: payload.timestamp
      };
      // Step 1: Fetch all orders
      const ordersRes = await fetch( `${process.env.NEXT_PUBLIC_URL}order/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      });

      const orders = await ordersRes.json();
      // Step 2: Filter all matching orders by transaction_id
      const matchedOrders = orders.filter(
        (order: any) => order.transation_ID_order === transactionIdToFind
      );

      if (matchedOrders.length > 0) {
        // Step 3: Loop through and update each matching order
        await Promise.all(
          matchedOrders.map(async (order: any) => {
            const updateRes = await fetch(
              `${process.env.NEXT_PUBLIC_URL}orderid/${order.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
                },
                body: JSON.stringify({
                  
                  status: 'pending',
                }),
              }
            );

            const re = await fetch(`${process.env.NEXT_PUBLIC_URL}emailcreateorder/`, {
              method: "POST",
              headers: {
                "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderEmail),
            });
    

            const updateData = await updateRes.json();
            //console.log(`Updated order ${order.id}:`, updateData);
          })
        );
      } else {
        console.log('No matching transaction ID found.');
      }


    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
