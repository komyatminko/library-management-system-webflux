package com.myat.java.springBoot.library.exception;

public class BookDetailsNotFoundException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;

	public BookDetailsNotFoundException(String msg) {
		super(msg);
	}

}
