package com.myat.java.springBoot.library.dto;

import java.util.List;

import com.myat.java.springBoot.library.model.Role;

public class UserDto {
	
	private String id;
	private String username;
	private String password;
	private String email;
	private List<Role> roles;
	private List<BorrowedBookDto> borrowedBooks;
	
	public UserDto() {}
	public UserDto(String id, String username, String password, String email, List<Role> roles,
			List<BorrowedBookDto> borrowedBooks) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
		this.roles = roles;
		this.borrowedBooks = borrowedBooks;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public List<Role> getRoles() {
		return roles;
	}
	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}
	public List<BorrowedBookDto> getBorrowedBooks() {
		return borrowedBooks;
	}
	public void setBorrowedBooks(List<BorrowedBookDto> borrowedBooks) {
		this.borrowedBooks = borrowedBooks;
	}

	
}
