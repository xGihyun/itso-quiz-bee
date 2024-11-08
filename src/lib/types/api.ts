export enum ApiResponseStatus {
  Success = "success",
  Error = "error",
  Fail = "fail",
}

export type ApiResponse<T = any> = {
  status: ApiResponseStatus;
  data: T;
  status_code: number;
  message?: string;
};
