package com.myat.java.springBoot.library.dto;

import java.util.Date;

public class BorrowedUserDto {

	private String id;
	private String userId;
	private String username;
	private Date issueDate;
	private Date returnDate;
	private Boolean isOverdue;
	
	public BorrowedUserDto() {}

	public BorrowedUserDto(String userId, String username, Date issueDate, Date returnDate, Boolean isOverdue) {
		this.userId = userId;
		this.username = username;
		this.issueDate = issueDate;
		this.returnDate = returnDate;
		this.isOverdue = isOverdue;
	}

	public BorrowedUserDto(String id, String userId, String username, Date issueDate, Date returnDate, Boolean isOverdue) {
		this.id = id;
		this.userId = userId;
		this.username = username;
		this.issueDate = issueDate;
		this.returnDate = returnDate;
		this.isOverdue = isOverdue;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Date getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}

	public Date getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(Date returnDate) {
		this.returnDate = returnDate;
	}

	public Boolean getIsOverdue() {
		return isOverdue;
	}

	public void setIsOverdue(Boolean isOverdue) {
		this.isOverdue = isOverdue;
	}

	@Override
	public String toString() {
		return "BorrowedUserDto [userId=" + userId + ", username=" + username + ", issueDate=" + issueDate
				+ ", returnDate=" + returnDate + ", isOverdue=" + isOverdue + "]";
	}
	
	
	
}
