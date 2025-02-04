package com.myat.java.springBoot.library.exception;

public class BorrowingNotFoundException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;

	public BorrowingNotFoundException(String msg) {
		super(msg);
	}

}
