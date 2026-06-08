package com.uniorder.integrationservice.service.impl;

import com.uniorder.integrationservice.client.CatalogClient;
import com.uniorder.integrationservice.client.OrderClient;
import com.uniorder.integrationservice.dto.facebook.FacebookWebhookEvent;
import com.uniorder.integrationservice.entity.PlatformStoreEntity;
import com.uniorder.integrationservice.repository.PlatformStoreRepository;
import com.uniorder.integrationservice.service.FacebookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniorder.catalog.dto.response.ProductResponse;
import com.uniorder.order.enums.OrderType;
import com.uniorder.order.request.CreateOrderRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FacebookServiceImpl implements FacebookService {

    private static final Pattern ORDER_PATTERN = Pattern.compile("đặt\\s+(\\d+)\\s+(.*)", Pattern.CASE_INSENSITIVE);

    private ObjectMapper mapper;

    private CatalogClient catalogClient;

    private OrderClient orderClient;

    private PlatformStoreRepository  platformStoreRepository;

    public FacebookServiceImpl(ObjectMapper mapper,
                               CatalogClient catalogClient,
                               OrderClient orderClient,
                               PlatformStoreRepository platformStoreRepository) {
        this.mapper = mapper;
        this.catalogClient = catalogClient;
        this.orderClient = orderClient;
        this.platformStoreRepository = platformStoreRepository;
    }

    @Async
    @Override
    public void processWebhook(String payload) {
        try {
            FacebookWebhookEvent event = mapper.readValue(payload, FacebookWebhookEvent.class);

            if ("page".equals(event.getObject())) {
                for (FacebookWebhookEvent.Entry entry : event.getEntry()) {
                    String pageId = entry.getId();

                    if (entry.getMessaging() != null) {
                        for (FacebookWebhookEvent.Messaging messaging : entry.getMessaging()) {
                            if (messaging.getMessage() != null && messaging.getMessage().getText() != null) {
                                String senderId = messaging.getSender().getId();
                                String messageText = messaging.getMessage().getText();

                                if (messageText.toLowerCase().startsWith("đặt")) {
                                    handleOrderCommand(pageId, senderId, messageText);
                                }
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Lỗi xử lý Facebook Event: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional(readOnly = true)
    @Override
    public void handleOrderCommand(String pageId, String senderId, String text) {
        PlatformStoreEntity store = platformStoreRepository.findByExternalStoreId(pageId)
                .orElse(null);

        if (store == null) {
            System.err.println("Không tìm thấy kết nối nào cho Page ID: " + pageId);
            return;
        }

        Long currentRestId = store.getConnection().getRestId();

        Matcher matcher = ORDER_PATTERN.matcher(text);

        if (matcher.find()) {
            int quantity = Integer.parseInt(matcher.group(1));
            String productName = matcher.group(2).trim();

            try {
                List<ProductResponse> products = catalogClient.searchProducts(productName, currentRestId);

                if (products != null && !products.isEmpty()) {
                    ProductResponse product = products.get(0);

                    // 4. Tạo đơn hàng bên Order Service
                    CreateOrderRequest orderReq = new CreateOrderRequest();
                    orderReq.setOrderType(OrderType.DELIVERY); // Mặc định là Delivery
                    orderReq.setNote("Đơn từ Facebook (PSID: " + senderId + ")");

                    CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
                    item.setProductId(product.getProductId());
                    item.setQuantity(quantity);

                    orderReq.setItems(List.of(item));

                    try {
                        orderClient.createOrder(orderReq, currentRestId);

                        // TODO: Gửi tin nhắn phản hồi lại cho khách (Sẽ làm sau)
                    } catch (Exception e) {
                        System.err.println("Lỗi tạo đơn bên Order Service: " + e.getMessage());
                    }
                } else {
                    System.err.println("-> Không tìm thấy món ăn nào tên là: {" + productName + "} trong nhà hàng ID {" + currentRestId + " }");
                }
            } catch (Exception e) {
                System.err.println("Lỗi gọi Catalog Service: " + e.getMessage());
            }
        }
    }
}
