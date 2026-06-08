package com.uniorder.catalogservice.dto.request;

import lombok.Data;

@Data
public class UpdateRestaurantRequest {

    private String name;
    private String address;
    private String phoneNumber;
    private String description;

}
