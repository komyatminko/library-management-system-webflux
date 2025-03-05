package com.myat.java.springBoot.library.dto;

import java.util.List;

import com.myat.java.springBoot.library.model.Role;

public class UserDto {
	
	private String userId;
	private String username;
//	private String password;
	private String email;
	private String phone;
	private String address;
	private List<Role> roles;
	private List<BorrowedBookDto> borrowedBooks;
	
	public UserDto() {}
	public UserDto(String id, String username, 
			String password, String email, 
			List<Role> roles, String phone, String address,
			List<BorrowedBookDto> borrowedBooks) {
		this.userId = id;
		this.username = username;
//		this.password = password;
		this.email = email;
		this.roles = roles;
		this.phone = phone;
		this.address = address;
		this.borrowedBooks = borrowedBooks;
	}
	
	public String getId() {
		return userId;
	}
	public void setId(String id) {
		this.userId = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
//	public String getPassword() {
//		return password;
//	}
//	public void setPassword(String password) {
//		this.password = password;
//	}
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
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	
}
