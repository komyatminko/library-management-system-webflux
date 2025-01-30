package com.myat.java.springBoot.library.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class ApiResponse {
    private String status;
    private int code;
    private String message;
    private Object data;
    private Object error;

    // Constructors
    public ApiResponse(String status, int code, String message, Object data, Object error) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    
    public ApiResponse() {}

    // Factory methods for success and error
    public static ApiResponse success(String message, int code, Object data) {
        return new ApiResponse("success", code, message, data, null);
    }

    public static ApiResponse error(int code, String message, Object errorDetails) {
        return new ApiResponse("error", code, message, null, errorDetails);
    }
    

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public Object getError() {
		return error;
	}

	public void setError(Object error) {
		this.error = error;
	}

    
}

