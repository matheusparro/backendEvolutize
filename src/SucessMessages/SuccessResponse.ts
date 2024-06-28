export default class SuccessResponse<T> {
    status: string;
    data: T | null;
    message: string;
  
    constructor(data: T | null, message: string = 'Operação bem-sucedida') {
      this.status = 'success';
      this.data = data;
      this.message = message;
    }
  
    static create<T>(data: T | null, message: string = 'Operação bem-sucedida'): SuccessResponse<T> {
      return new SuccessResponse<T>(data, message);
    }
  }
  