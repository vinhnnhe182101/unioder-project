package com.uniorder.catalogservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantResponse {
    private Long restId;
    private String name;
    private String address;
    private String phoneNumber;
    private String logoUrl;
    private String description;
    private String status;
}
