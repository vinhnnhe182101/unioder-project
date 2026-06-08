package com.uniorder.catalogservice.service.impl;

import com.uniorder.catalog.dto.request.CreateOptionItemRequest;
import com.uniorder.catalog.dto.request.CreateOptionRequest;
import com.uniorder.catalog.dto.response.OptionResponse;
import com.uniorder.catalogservice.config.RestaurantContext;
import com.uniorder.catalogservice.entity.ProductOptionEntity;
import com.uniorder.catalogservice.entity.ProductOptionItemEntity;
import com.uniorder.catalogservice.mapper.OptionMapper;
import com.uniorder.catalogservice.repository.ProductOptionItemRepository;
import com.uniorder.catalogservice.repository.ProductOptionRepository;
import com.uniorder.catalogservice.service.OptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OptionServiceImpl implements OptionService {

    private ProductOptionRepository productOptionRepository;
    private ProductOptionItemRepository productOptionItemRepository;
    private OptionMapper optionMapper;

    public OptionServiceImpl(ProductOptionRepository productOptionRepository, ProductOptionItemRepository productOptionItemRepository, OptionMapper optionMapper) {
        this.productOptionRepository = productOptionRepository;
        this.productOptionItemRepository = productOptionItemRepository;
        this.optionMapper = optionMapper;
    }

    @Transactional
    @Override
    public OptionResponse createOptionGroup(CreateOptionRequest request) {

        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        ProductOptionEntity option = optionMapper.toEntity(request);

        option.setRestId(restId);

        ProductOptionEntity savedOption = productOptionRepository.save(option);
        return optionMapper.toResponse(savedOption);
    }

    @Transactional
    @Override
    public OptionResponse addItemToGroup(Long optionId, CreateOptionItemRequest request) {

        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        ProductOptionEntity optionGroup = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option Not Found"));

        if (!optionGroup.getRestId().equals(restId)) {
            throw new RuntimeException("Unauthorized access to this option group");
        }

        ProductOptionItemEntity item = optionMapper.toItemEntity(request);
        item.setProductOption(optionGroup);

        productOptionItemRepository.save(item);

        return optionMapper.toResponse(optionGroup);
    }

    @Transactional(readOnly = true)
    @Override
    public List<OptionResponse> getMyOptions() {
        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        return productOptionRepository.findByRestId(restId).stream()
                .map(optionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
