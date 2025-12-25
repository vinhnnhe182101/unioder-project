package com.example.orderservice.domain.option;

import com.fasterxml.jackson.core.type.TypeReference;
import com.example.orderservice.dto.request.SelectedOptionDto;
import com.example.orderservice.entity.OrderItemEntity;
import com.example.orderservice.entity.OrderItemOptionEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class OptionNormalizer {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static List<OrderItemOptionEntity> normalize(
            String json,
            OrderItemEntity item
    ) {
        try {
            List<SelectedOptionDto> dtos =
                    mapper.readValue(
                            json,
                            new TypeReference<List<SelectedOptionDto>>() {}
                    );

            return dtos.stream().map(dto ->
                    OrderItemOptionEntity.builder()
                            .orderItem(item)
                            .optionGroupName(dto.getName())
                            .optionItemName(dto.getChoice())
                            .extraPrice(dto.getPrice())
                            .build()
            ).toList();

        } catch (Exception e) {
            throw new RuntimeException("Invalid option json", e);
        }
    }
}
