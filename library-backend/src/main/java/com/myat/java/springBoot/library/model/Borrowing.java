package com.myat.java.springBoot.library.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "borrowings")
public class Borrowing {

	@Id
	private String id;
	private String userId;
	private String bookId;
	private Date issueDate;
	private Date returnDate;
	private Boolean isOverdue;
	
	public Borrowing() {}

	
	public Borrowing(String userId, String bookId, Date issueDate, Date returnDate, Boolean isOverdue) {
		this.userId = userId;
		this.bookId = bookId;
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

	public String getBookId() {
		return bookId;
	}

	public void setBookId(String bookId) {
		this.bookId = bookId;
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
	
	
}
