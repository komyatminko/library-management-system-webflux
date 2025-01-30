package com.myat.java.springBoot.library.dto;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.myat.java.springBoot.library.model.Author;
import com.myat.java.springBoot.library.model.BookDetails;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BookDto {

	private String id;
	
	private String name;

	private BookDetailsDto bookDetails;

	private AuthorDto author;

	private Date updatedAt;

	private Date createdAt;
	
	public BookDto() {}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BookDetailsDto getBookDetails() {
		return bookDetails;
	}

	public void setBookDetails(BookDetailsDto bookDetails) {
		this.bookDetails = bookDetails;
	}

	public AuthorDto getAuthor() {
		return author;
	}

	public void setAuthor(AuthorDto author) {
		this.author = author;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	
	
}
