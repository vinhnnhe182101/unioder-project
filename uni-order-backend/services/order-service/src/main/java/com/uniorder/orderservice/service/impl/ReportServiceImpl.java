package com.uniorder.orderservice.service.impl;

import com.uniorder.orderservice.config.RestaurantContext;
import com.uniorder.orderservice.dto.response.RevenueStatsResponse;
import com.uniorder.orderservice.dto.response.TopProductResponse;
import com.uniorder.orderservice.entity.OrderEntity;
import com.uniorder.orderservice.repository.OrderRepository;
import com.uniorder.orderservice.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private OrderRepository orderRepository;

    public ReportServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public List<RevenueStatsResponse> getRevenueStats(String type, LocalDate from, LocalDate to) {
        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) throw new RuntimeException("Unauthorized");

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);

        List<OrderEntity> orders = orderRepository.findCompletedOrdersInRange(restId, start, end);

        Map<String, List<OrderEntity>> groupedData = new LinkedHashMap<>();
        DateTimeFormatter formatter;

        if ("MONTH".equalsIgnoreCase(type)) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM"); // Gom theo tháng
        } else if ("YEAR".equalsIgnoreCase(type)) {
            formatter = DateTimeFormatter.ofPattern("yyyy"); // Gom theo năm
        } else {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Gom theo ngày (Mặc định)
        }

        for (OrderEntity order : orders) {
            String key = order.getCreatedAt().format(formatter);
            groupedData.computeIfAbsent(key, k -> new ArrayList<>()).add(order);
        }

        return groupedData.entrySet().stream().map(entry -> {
            BigDecimal total = entry.getValue().stream()
                    .map(OrderEntity::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return RevenueStatsResponse.builder()
                    .timePoint(entry.getKey())
                    .totalRevenue(total)
                    .totalOrders((long) entry.getValue().size())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<TopProductResponse> getTopProducts(LocalDate from, LocalDate to) {
        Long restId = RestaurantContext.getRestaurantId();
        return orderRepository.findTopProducts(restId, from.atStartOfDay(), to.atTime(LocalTime.MAX));
    }
}
