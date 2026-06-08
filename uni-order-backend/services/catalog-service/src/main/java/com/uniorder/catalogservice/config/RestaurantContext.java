package com.uniorder.catalogservice.config;

public class RestaurantContext {
    private static final ThreadLocal<Long> CURRENT_RESTAURANT = new  ThreadLocal<>();

    public static void setRestaurantId(Long restaurantId) {
        CURRENT_RESTAURANT.set(restaurantId);
    }

    public static Long getRestaurantId() {
        return CURRENT_RESTAURANT.get();
    }

    public static void clear() {
        CURRENT_RESTAURANT.remove();
    }
}
