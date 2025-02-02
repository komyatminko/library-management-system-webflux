package com.myat.java.springBoot.library.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Document(collection = "book_details")
public class BookDetails {

	@Id
	private String id;
	
	@NotBlank
	private String details;
	
	@NotBlank
	private List<String> genres;
	
	@NotNull
	private Integer page;
	
	public BookDetails() {}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}
	
	public List<String> getGenres() {
		return genres;
	}

	public void setGenres(List<String> categories) {
		this.genres = categories;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	@Override
	public String toString() {
		return "BookDetails [id=" + id + ", details=" + details + ", genres=" + genres + ", page=" + page + "]";
	}
	
	
}
