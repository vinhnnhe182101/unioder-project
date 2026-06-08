package com.uniorder.catalogservice.service;

import com.uniorder.catalog.dto.request.CreateOptionItemRequest;
import com.uniorder.catalog.dto.request.CreateOptionRequest;
import com.uniorder.catalog.dto.response.OptionResponse;

import java.util.List;

public interface OptionService {

    OptionResponse createOptionGroup(CreateOptionRequest request);

    OptionResponse addItemToGroup(Long optionId, CreateOptionItemRequest request);

    List<OptionResponse> getMyOptions();


}
