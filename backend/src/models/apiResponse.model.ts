export class ApiResponse {
  message: string;
  data?: any;
  success: boolean;
  constructor(message: string, data?: any) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
