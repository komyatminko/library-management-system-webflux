package com.myat.java.springBoot.library.dto;

import java.util.Date;

public class BorrowedBookDto {

	private String bookId;
	private String bookName;
	private String authorName;
	private Date issueDate;
	private Date returnDate;
	private Boolean isOverdue;
	public BorrowedBookDto(String bookId, String bookName, String authorName, Date issueDate, Date returnDate,
			Boolean isOverdue) {
		this.bookId = bookId;
		this.bookName = bookName;
		this.authorName = authorName;
		this.issueDate = issueDate;
		this.returnDate = returnDate;
		this.isOverdue = isOverdue;
	}
	public String getId() {
		return bookId;
	}
	public void setId(String id) {
		this.bookId = id;
	}
	public String getBookName() {
		return bookName;
	}
	public void setBookName(String bookName) {
		this.bookName = bookName;
	}
	public String getAuthorName() {
		return authorName;
	}
	public void setAuthorName(String authorName) {
		this.authorName = authorName;
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
