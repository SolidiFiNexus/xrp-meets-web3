type Methods = "get_balance" | "ledger_index" | "request_accounts";

export interface ProviderMessage {
  type: "api-request" | "web3-send-async-read-only";
  permission: "web3";
  id: any;
  name: any;
  data: any;
  method: any;
  messageId: number;
  params?: string[];
  host: string;
  payload: { id: number; jsonrpc: "2.0"; method: Methods; params?: any[] | any };
}

export interface JSONRPCResponse {
  messageId: number;
  type: "web3-send-async-callback";
  result: { id: number; jsonrpc: "2.0"; result?: string | string[] | null | any };
  error?: { code: any };
}
