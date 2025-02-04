package com.myat.java.springBoot.library.model;

import java.util.Date;

public class BorrowedUser {
	private String userId;
	private String username;
	private Date issueDate;
	private Date returnDate;
	private Boolean isOverdue;
	public BorrowedUser(String userId, String username, Date issueDate, Date returnDate, Boolean isOverdue) {

		this.userId = userId;
		this.username = username;
		this.issueDate = issueDate;
		this.returnDate = returnDate;
		this.isOverdue = isOverdue;
	}
	
	
}
