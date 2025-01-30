package com.myat.java.springBoot.library.dto;

public class JWTToken {
	private String token;
	
	

	public JWTToken(String token) {
		super();
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
}
