class ApiError extends Error {
  statusCode: number;
  success: boolean;
  error: string;
  constructor(
    statusCode: number = 500,
    error: string = "Server Error",
    message: string = "Server Error, Please try after sometime."
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.error = error;
  }
}

export default ApiError;
