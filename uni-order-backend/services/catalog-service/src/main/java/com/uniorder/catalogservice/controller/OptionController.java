package com.uniorder.catalogservice.controller;

import jakarta.validation.Valid;
import com.uniorder.catalog.dto.request.CreateOptionItemRequest;
import com.uniorder.catalog.dto.request.CreateOptionRequest;
import com.uniorder.catalog.dto.response.OptionResponse;
import com.uniorder.catalogservice.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/options")
public class OptionController {

    @Autowired
    private OptionService optionService;

    @PostMapping
    public ResponseEntity<OptionResponse> createOptionGroup(
            @Valid @RequestBody CreateOptionRequest createOptionRequest
    ) {
        return ResponseEntity.ok(optionService.createOptionGroup(createOptionRequest));
    }

    @PostMapping("/{optionId}/items")
    public ResponseEntity<OptionResponse> addOptionItem(
            @PathVariable Long optionId,
            @Valid @RequestBody CreateOptionItemRequest request) {
        return ResponseEntity.ok(optionService.addItemToGroup(optionId, request));
    }

    @GetMapping
    public ResponseEntity<List<OptionResponse>> getMyOptions() {
        return ResponseEntity.ok(optionService.getMyOptions());
    }
}
