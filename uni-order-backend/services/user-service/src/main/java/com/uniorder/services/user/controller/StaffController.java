package com.uniorder.services.user.controller;

import com.uniorder.services.user.dto.request.StaffDTO;
import com.uniorder.services.user.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/staff")
public class StaffController {

    private StaffService staffService;

    @Autowired
    public void setStaffService(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('staff:manage', 'ROLE_OWNER', 'ROLE_MANAGER')")
    public ResponseEntity<List<StaffDTO>> getStaffList(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(staffService.getStaffByRestaurant(restaurantId));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('staff:manage', 'ROLE_OWNER')")
    public ResponseEntity<String> addStaff(
            @PathVariable Long restaurantId,
            @RequestParam String email,
            @RequestParam String roleName
    ) {
        staffService.addStaffToRestaurant(restaurantId, email, roleName);
        return ResponseEntity.ok("Đã thêm nhân viên thành công");
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('staff:manage', 'ROLE_OWNER')")
    public ResponseEntity<Void> removeStaff(
            @PathVariable Long restaurantId,
            @PathVariable Long userId,
            @RequestParam String roleName
    ) {
        staffService.removeStaffFromRestaurant(restaurantId, userId, roleName);
        return ResponseEntity.noContent().build();
    }
}
