export enum ApiResponseStatus {
	Success = "success",
	Error = "error",
	Fail = "fail"
}

export type ApiResponse<T = unknown> = {
	data: T;
	status: ApiResponseStatus;
	status_code: number;
	message: string;
};
