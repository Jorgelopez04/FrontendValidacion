export interface ResponseDto<T> { 
    statusCode: number; 
    message: string; 
    data: T; 
} 