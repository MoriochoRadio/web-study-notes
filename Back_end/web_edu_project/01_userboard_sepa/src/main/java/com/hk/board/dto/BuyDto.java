package com.hk.board.dto;
import java.io.Serializable;

public class BuyDto implements Serializable {
	private int num;
	private String userId;
	private String proudName;
	private String groupName;
	private int price;
	private int amount;
	
	public BuyDto() {
		
	}

	public BuyDto(int num, String userId, String proudName, String groupName, int price, int amount) {
		super();
		this.num = num;
		this.userId = userId;
		this.proudName = proudName;
		this.groupName = groupName;
		this.price = price;
		this.amount = amount;
	}

	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getProudName() {
		return proudName;
	}

	public void setProudName(String proudName) {
		this.proudName = proudName;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	@Override
	public String toString() {
		return "BuyDto [num=" + num + ", userId=" + userId + ", proudName=" + proudName + ", groupName=" + groupName
				+ ", price=" + price + ", amount=" + amount + "]";
	}
	
	
	
	
}
