package com.example.orderservice.service;

import com.example.orderservice.dto.response.RevenueStatsResponse;
import com.example.orderservice.dto.response.TopProductResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    List<RevenueStatsResponse> getRevenueStats(String type, LocalDate from, LocalDate to);

    List<TopProductResponse> getTopProducts(LocalDate from, LocalDate to);
}
