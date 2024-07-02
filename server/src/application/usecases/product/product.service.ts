import {
    BadRequestError,
    NotFoundError,
} from "../../../shared/core/error.response";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../shared/constants/types";
import { IProductRepository } from "../../../domain/repositories/product.interface";
import { IProductService } from "./product.interface";
import {
    ProductDTO,
    ProductItemDTO,
    UpdateProductDTO,
} from "../../dtos/product.dto";
import { Product, SmartPhone } from "../../../domain/entities/product/product";
import slugify from "slugify";

//Product Factory
@injectable()
export class ProductService implements IProductService {
    private _productRepo: IProductRepository;

    constructor(
        @inject(TYPES.ProductRepository) productRepo: IProductRepository
    ) {
        this._productRepo = productRepo;
    }

    public async createProduct(body: ProductDTO) {
        const { type, ...payload } = body;
        const product = new SmartPhone(
            payload.name,
            payload.desc,
            payload.originalPrice,
            payload.salePrice,
            payload.categoryId,
            payload.brandId,
            true,
            false,
            null,
            payload.colorId,
            payload.ramId,
            payload.internalId,
            null,
            null
        );
        const newProduct = await this._productRepo.create(product);

        if (!newProduct) throw new BadRequestError("Error create product");
        console.log(newProduct.id);
        const newChildren = await this._productRepo.createProductChildren(
            type,
            newProduct.id,
            product
        );

        if (!newChildren) throw new BadRequestError("Error create product");

        return { newProduct, newChildren };
    }

    async createProductItem(body: ProductItemDTO): Promise<any> {
        const findProduct = await this._productRepo.findProductById(
            body.productId
        );

        if (!findProduct) throw new NotFoundError("Product not found!");
        const productChildren = await this._productRepo.createProductChildren(
            "smartphones",
            findProduct.id,
            body
        );

        return productChildren;
    }

    async updateProduct(
        productItemId: number,
        body: UpdateProductDTO
    ): Promise<any> {
        const productItem = await this._productRepo.findProductById(
            productItemId
        );

        console.log(productItem);
        if (!productItem) throw new NotFoundError("Product not found!");

        const updateProduct = await this._productRepo.update(
            productItem.productId,
            productItemId,
            body
        );

        return updateProduct;
    }

    async publishProduct(productId: number): Promise<any> {
        return await this._productRepo.publishProductById(productId);
    }

    async unPublishProduct(productId: number): Promise<any> {
        return await this._productRepo.unPublishProductById(productId);
    }

    async getPublishs({
        limit,
        skip,
    }: {
        limit: number;
        skip: number;
    }): Promise<any> {
        const query = { isPublished: true };
        const data = await this._productRepo.queryProduct(query, limit, skip);
        return data;
    }

    async getDrafts({
        limit,
        skip,
    }: {
        limit: number;
        skip: number;
    }): Promise<any> {
        const query = { isDraft: true };
        const data = await this._productRepo.queryProduct(query, limit, skip);
        return data;
    }

    async searchs(keySearch: string): Promise<any> {
        const data = await this._productRepo.searchProducts(keySearch);

        return data;
    }

    async getProducts({
        limit,
        sort,
        page,
        filter,
    }: {
        limit: number;
        sort: string;
        page: number;
        filter: any;
    }): Promise<any> {
        return await this._productRepo.findProducts(limit, sort, page, filter);
    }

    async getProduct(id: number): Promise<any> {
        return await this._productRepo.findProduct(id);
    }
}
