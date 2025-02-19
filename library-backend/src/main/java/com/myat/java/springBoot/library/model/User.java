package com.myat.java.springBoot.library.model;

import java.util.List;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "users")
public class User {

	@Id
	private String id;
	private String username;
	private String password;
	private String email;
	private String phone;
	private String address;
	private List<Role> roles;
	private Integer issueBooksCount;

	public User(String id, String username, 
			String password, String email, 
			String address, String phone,
			List<Role> roles, Integer issueBookscount) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.roles = roles;
		this.issueBooksCount = issueBookscount;
	}
	
	public User() {}

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

	public Integer getIssueBooksCount() {
		return issueBooksCount;
	}

	public void setIssueBooksCount(Integer issueBooksCount) {
		this.issueBooksCount = issueBooksCount;
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
