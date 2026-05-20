package org.example.catalogservice.service.impl;

import org.example.catalog.dto.request.CreateProductRequest;
import org.example.catalog.dto.response.ProductResponse;
import org.example.catalogservice.config.RestaurantContext;
import org.example.catalogservice.entity.CategoryEntity;
import org.example.catalogservice.entity.ProductEntity;
import org.example.catalogservice.entity.ProductOptionEntity;
import org.example.catalogservice.entity.RestaurantEntity;
import org.example.catalogservice.mapper.ProductMapper;
import org.example.catalogservice.repository.CategoryRepository;
import org.example.catalogservice.repository.ProductOptionRepository;
import org.example.catalogservice.repository.ProductRepository;
import org.example.catalogservice.repository.RestaurantRepository;
import org.example.catalogservice.service.ProductService;
import org.example.common.util.FileStorageUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private RestaurantRepository restaurantRepository;
    private ProductOptionRepository productOptionRepository;
    private ProductMapper productMapper;
    private FileStorageUtil fileStorageUtil;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            RestaurantRepository restaurantRepository,
            ProductOptionRepository productOptionRepository,
            ProductMapper productMapper,
            FileStorageUtil fileStorageUtil) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.restaurantRepository = restaurantRepository;
        this.productOptionRepository = productOptionRepository;
        this.productMapper = productMapper;
        this.fileStorageUtil = fileStorageUtil;
    }

    @Transactional
    @Override
    public ProductResponse createProduct(CreateProductRequest request, MultipartFile file){
        Long restId = RestaurantContext.getRestaurantId();
        if (restId == null) {
            throw new RuntimeException("Unauthorized request");
        }

        RestaurantEntity restaurantEntity = restaurantRepository.findById(restId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        CategoryEntity categoryEntity = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!categoryEntity.getRestaurant().getRestId().equals(restId)) {
            throw new RuntimeException("Invalid Category for this Restaurant");
        }

        ProductEntity productEntity = productMapper.toEntity(request);
        productEntity.setRestaurant(restaurantEntity);
        productEntity.setCategory(categoryEntity);

        if (file != null && !file.isEmpty()) {
            String imgUrl = fileStorageUtil.storeImage(file, "products");
            productEntity.setImgUrl(imgUrl);
        } else if (request.getImgUrl() != null) {
            productEntity.setImgUrl(request.getImgUrl());
        }

        if (request.getOptionIds() != null) {
            List<ProductOptionEntity> options = productOptionRepository.findAllById(request.getOptionIds());
            for (ProductOptionEntity opt : options) {
                if (!opt.getRestId().equals(restId)) throw new RuntimeException("Invalid Option");
            }
            productEntity.setOptions(options);
        }

        ProductEntity savedProduct = productRepository.save(productEntity);
        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long productId, CreateProductRequest request, MultipartFile file) {
        Long restId = RestaurantContext.getRestaurantId();
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getRestaurant().getRestId().equals(restId)) {
            throw new RuntimeException("Unauthorized update");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSku(request.getSku());

        // Update Category
        if (!product.getCategory().getCategoryId().equals(request.getCategoryId())) {
            CategoryEntity newCategory = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            if (!newCategory.getRestaurant().getRestId().equals(restId)) throw new RuntimeException("Invalid Category");
            product.setCategory(newCategory);
        }

        // [MỚI] Xử lý Update ảnh
        if (file != null && !file.isEmpty()) {
            fileStorageUtil.deleteFile(product.getImgUrl());

            String imgUrl = fileStorageUtil.storeImage(file, "products");
            product.setImgUrl(imgUrl);
        } else if (request.getImgUrl() != null) {
            product.setImgUrl(request.getImgUrl());
        }

        // Update Option
        if (request.getOptionIds() != null) {

            product.getOptionAssignments().clear();

            productRepository.flush();

            List<ProductOptionEntity> newOptions = productOptionRepository.findAllById(request.getOptionIds());

            int displayOrder = 0;
            for (ProductOptionEntity opt : newOptions) {
                if (!opt.getRestId().equals(restId)) throw new RuntimeException("Invalid Option");

                product.addOption(opt, displayOrder++);
            }
        }

        ProductEntity savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    @Transactional
    @Override
    public void deleteProduct(Long productId) {
        Long restId = RestaurantContext.getRestaurantId();
        ProductEntity product = productRepository.findById(productId).orElseThrow();
        if (!product.getRestaurant().getRestId().equals(restId)) throw new RuntimeException("Unauthorized");

        fileStorageUtil.deleteFile(product.getImgUrl());

        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductResponse> getMyProducts() {
        Long restId = RestaurantContext.getRestaurantId();
        return productRepository.findByRestaurant_RestId(restId).stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public ProductResponse getProductById(Long productId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        return productMapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> validateProducts(List<Long> productIds) {
        List<ProductEntity> products = productRepository.findAllById(productIds);
        if (products.size() != productIds.size()) throw new RuntimeException("Invalid Product IDs");

        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductResponse> searchProducts(String keyword, Long restId) {
        List<ProductEntity> products = productRepository.findByRestaurant_RestIdAndNameContainingIgnoreCase(restId, keyword);

        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void toggleProductAvailability(Long productId) {
        Long restId = RestaurantContext.getRestaurantId();
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getRestaurant().getRestId().equals(restId)) {
            throw new RuntimeException("Unauthorized");
        }

        product.setAvailable(!product.isAvailable());
        productRepository.save(product);
    }
}
