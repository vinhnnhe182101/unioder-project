package com.uniorder.catalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRestaurantRequest {

    @NotBlank(message = "Restaurant name must not be blank!")
    private String name;

    private String address;
    private String phoneNumber;
    private String description;
}
