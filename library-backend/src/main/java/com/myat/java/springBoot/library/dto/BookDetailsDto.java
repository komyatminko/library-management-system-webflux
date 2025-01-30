package com.myat.java.springBoot.library.dto;

import java.util.List;

public class BookDetailsDto {

	private String id;
	private String details;
	private List<String> genres;
	private Integer page;
	
	public BookDetailsDto() {}

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

	public void setGenres(List<String> genres) {
		this.genres = genres;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}
	
	
}
