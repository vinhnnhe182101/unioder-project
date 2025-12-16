import axiosClient from '../config/axiosConfig';

const CATALOG_BASE_URL = '/catalog'; // Gateway sẽ route /api/catalog -> catalog-service

const catalogService = {
    // --- CATEGORIES ---
    getCategories: () => {
        return axiosClient.get(`${CATALOG_BASE_URL}/categories`);
    },

    createCategory: (data) => {
        return axiosClient.post(`${CATALOG_BASE_URL}/categories`, data);
    },

    // --- OPTIONS ---
    getOptions: () => {
        return axiosClient.get(`${CATALOG_BASE_URL}/options`);
    },

    createOption: (data) => {
        return axiosClient.post(`${CATALOG_BASE_URL}/options`, data);
    },

    addOptionItem: (optionId, data) => {
        return axiosClient.post(`${CATALOG_BASE_URL}/options/${optionId}/items`, data);
    },


    // --- PRODUCTS ---
    getProducts: () => {
        return axiosClient.get(`${CATALOG_BASE_URL}/products`);
    },

    createProduct: (formData) => {
        return axiosClient.post(`${CATALOG_BASE_URL}/products`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateProduct: (id, formData) => {
        return axiosClient.put(`${CATALOG_BASE_URL}/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    toggleProductAvailability: (productId, isAvailable) => {
        return axiosClient.put(`${BASE_URL}/products/${productId}`, { isAvailable });
    }
};

export default catalogService;