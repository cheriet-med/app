import type { 
    BTCPayInvoice, 
    CreateInvoiceRequest, 
    BTCPayStore, 
    PaymentMethod,
    GetInvoicesOptions 
  } from '@/types/btcpay';
  
  interface RequestConfig extends RequestInit {
    headers?: Record<string, string>;
  }
  
  class BTCPayService {
    private baseURL: string;
    private storeId: string;
    private apiKey: string;
    private apiBaseURL: string;
  
    constructor() {
      this.baseURL = process.env.BTCPAY_SERVER_URL!;
      this.storeId = process.env.BTCPAY_STORE_ID!;
      this.apiKey = process.env.BTCPAY_API_KEY!;
      this.apiBaseURL = `${this.baseURL}/api/v1`;
  
      if (!this.baseURL || !this.storeId || !this.apiKey) {
        throw new Error('Missing required BTCPay Server environment variables');
      }
    }
  
    // Helper method for making API requests
    private async makeRequest<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
      const url = `${this.apiBaseURL}${endpoint}`;
      const config: RequestConfig = {
        headers: {
          'Authorization': `token ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }
  
        return await response.json() as T;
      } catch (error) {
        console.error(`BTCPay API Error (${endpoint}):`, error instanceof Error ? error.message : error);
        throw error;
      }
    }
  
    // Create an invoice
    async createInvoice(invoiceData: CreateInvoiceRequest): Promise<BTCPayInvoice> {
      const payload = {
        amount: invoiceData.amount.toString(),
        currency: invoiceData.currency || 'USD',
        orderId: invoiceData.orderId,
        itemDesc: invoiceData.itemDesc,
        itemCode: invoiceData.itemCode,
        notificationURL: invoiceData.notificationURL,
        redirectURL: invoiceData.redirectURL,
        metadata: invoiceData.metadata || {},
        checkout: invoiceData.checkout,
      };
  
      return await this.makeRequest<BTCPayInvoice>(`/stores/${this.storeId}/invoices`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
  
    // Get invoice by ID
    async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
      return await this.makeRequest<BTCPayInvoice>(`/stores/${this.storeId}/invoices/${invoiceId}`);
    }
  
    // Get all invoices
    async getInvoices(options: GetInvoicesOptions = {}): Promise<BTCPayInvoice[]> {
      const params = new URLSearchParams();
      
      if (options.status?.length) {
        options.status.forEach(status => params.append('status', status));
      }
      if (options.orderId) params.append('orderId', options.orderId);
      if (options.itemCode) params.append('itemCode', options.itemCode);
      if (options.take) params.append('take', options.take.toString());
      if (options.skip) params.append('skip', options.skip.toString());
  
      const endpoint = `/stores/${this.storeId}/invoices${params.toString() ? `?${params}` : ''}`;
      return await this.makeRequest<BTCPayInvoice[]>(endpoint);
    }
  
    // Mark invoice as invalid
    async markInvoiceInvalid(invoiceId: string): Promise<BTCPayInvoice> {
      return await this.makeRequest<BTCPayInvoice>(`/stores/${this.storeId}/invoices/${invoiceId}/status`, {
        method: 'POST',
      });
    }
  
    // Archive invoice
    async archiveInvoice(invoiceId: string): Promise<BTCPayInvoice> {
      return await this.makeRequest<BTCPayInvoice>(`/stores/${this.storeId}/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
    }
  
    // Get store info
    async getStore(): Promise<BTCPayStore> {
      return await this.makeRequest<BTCPayStore>(`/stores/${this.storeId}`);
    }
  
    // Get payment methods
    async getPaymentMethods(): Promise<PaymentMethod[]> {
      return await this.makeRequest<PaymentMethod[]>(`/stores/${this.storeId}/payment-methods`);
    }
  }
  
  export const btcPayService = new BTCPayService();