package com.myat.java.springBoot.library.dto;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.myat.java.springBoot.library.model.Author;
import com.myat.java.springBoot.library.model.Book;
import com.myat.java.springBoot.library.model.BookDetails;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BookDto {

	private String id;
	
	private String uniqueBookId;
	
	private String name;
	
	private String imgUrl;

	private BookDetailsDto bookDetails;

	private AuthorDto author;
	
	private Double price;
	
	private Double rating;
	
	private Boolean isAvailable;
	
	private Integer totalCount;
	
	private Integer availableCount;
	
	private List<BorrowedUserDto> borrowedBy;

	private Date updatedAt;

	private Date createdAt;
	
	public BookDto() {}
	
	public BookDto(String id, String name, String imgUrl, BookDetailsDto bookDetails, AuthorDto author, 
			Double rating, Double price, Integer totalCount,
			Boolean isAvailable, Integer availableCount, List<BorrowedUserDto> borrowedBy, Date updatedAt,
			Date createdAt) {
		this.id = id;
		this.name = name;
		this.imgUrl = imgUrl;
		this.bookDetails = bookDetails;
		this.author = author;
		this.price = price;
		this.rating = rating;
		this.totalCount = totalCount;
		this.isAvailable = isAvailable;
		this.availableCount = availableCount;
		this.borrowedBy = borrowedBy;
		this.updatedAt = updatedAt;
		this.createdAt = createdAt;
	}



	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getUniqueBookId() {
		return uniqueBookId;
	}

	public void setUniqueBookId(String uniqueBookId) {
		this.uniqueBookId = uniqueBookId;
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
	
	public Boolean getIsAvailable() {
		return isAvailable;
	}

	public void setIsAvailable(Boolean isAvailable) {
		this.isAvailable = isAvailable;
	}

	public Integer getAvailableCount() {
		return availableCount;
	}

	public void setAvailableCount(Integer availableCount) {
		this.availableCount = availableCount;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public List<BorrowedUserDto> getBorrowedBy() {
		return borrowedBy;
	}

	public void setBorrowedBy(List<BorrowedUserDto> borrowedBy) {
		this.borrowedBy = borrowedBy;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
	
	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}

	@Override
	public String toString() {
		return "BookDto [id=" + id + ", uniqueBookId=" + uniqueBookId + ", name=" + name + ", imgUrl=" + imgUrl
				+ ", bookDetails=" + bookDetails + ", isAvailable=" + isAvailable + ", totalCount=" + totalCount
				+ ", availableCount=" + availableCount + ", borrowedBy=" + borrowedBy + "]";
	}
	
	
	
}
