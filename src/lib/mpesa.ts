import axios from 'axios'

interface MPesaConfig {
  consumerKey: string
  consumerSecret: string
  businessShortCode: string
  passkey: string
  environment: 'sandbox' | 'production'
}

interface STKPushRequest {
  phoneNumber: string
  amount: number
  orderId: string
  description: string
}

interface STKPushResponse {
  success: boolean
  checkoutRequestId?: string
  errorMessage?: string
}

class MPesaService {
  private config: MPesaConfig
  private baseURL: string

  constructor() {
    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY!,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
      businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE!,
      passkey: process.env.MPESA_PASSKEY!,
      environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
    }
    
    this.baseURL = this.config.environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke'
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64')

    try {
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      )

      return response.data.access_token
    } catch (error) {
      console.error('Error getting access token:', error)
      throw new Error('Failed to get M-Pesa access token')
    }
  }

  private generatePassword(): string {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14)
    const password = Buffer.from(
      `${this.config.businessShortCode}${this.config.passkey}${timestamp}`
    ).toString('base64')
    
    return password
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14)
  }

  async initiateSTKPush({
    phoneNumber,
    amount,
    orderId,
    description
  }: STKPushRequest): Promise<STKPushResponse> {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.getTimestamp()
      const password = this.generatePassword()

      const requestBody = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: this.config.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: orderId,
        TransactionDesc: description
      }

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.ResponseCode === '0') {
        return {
          success: true,
          checkoutRequestId: response.data.CheckoutRequestID
        }
      } else {
        return {
          success: false,
          errorMessage: response.data.errorMessage || 'Transaction failed'
        }
      }
    } catch (error: any) {
      console.error('STK Push error:', error)
      return {
        success: false,
        errorMessage: error.response?.data?.errorMessage || 'Payment initiation failed'
      }
    }
  }

  async checkTransactionStatus(checkoutRequestId: string) {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.getTimestamp()
      const password = this.generatePassword()

      const requestBody = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      }

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Transaction status check error:', error)
      throw error
    }
  }
}

export const mpesaService = new MPesaService()
