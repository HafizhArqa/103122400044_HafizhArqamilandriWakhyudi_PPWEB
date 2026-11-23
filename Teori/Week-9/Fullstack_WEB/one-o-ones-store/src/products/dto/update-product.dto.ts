import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto.js';

/**
 * DTO untuk operasi PATCH (pembaruan sebagian data produk).
 * Seluruh properti bersifat opsional, tetapi aturan validasi class-validator tetap berlaku.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
