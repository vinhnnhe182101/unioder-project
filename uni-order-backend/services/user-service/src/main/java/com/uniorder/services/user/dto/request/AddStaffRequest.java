package com.uniorder.services.user.dto.request;

import lombok.Data;

@Data
public class AddStaffRequest {
    private String email;
    private String roleName;
}
