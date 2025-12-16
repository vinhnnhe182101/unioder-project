package org.example.catalogservice.service;

import org.example.catalog.dto.request.CreateOptionItemRequest;
import org.example.catalog.dto.request.CreateOptionRequest;
import org.example.catalog.dto.response.OptionResponse;

import java.util.List;

public interface OptionService {

    OptionResponse createOptionGroup(CreateOptionRequest request);

    OptionResponse addItemToGroup(Long optionId, CreateOptionItemRequest request);

    List<OptionResponse> getMyOptions();


}
