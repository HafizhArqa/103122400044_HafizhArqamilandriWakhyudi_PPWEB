import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_ICONS,
  PRODUCT_THEME_COLORS,
  type ProductCategory,
  type ProductIconType,
  type ProductThemeColor,
} from '../entities/product.entity.js';

export class CreateProductDto {
  @IsString({ message: 'SKU harus berupa teks.' })
  @IsNotEmpty({ message: 'SKU produk wajib diisi.' })
  @Matches(/^101-[A-Z]{3}-\d{3}$/, {
    message: 'Format SKU harus 101-XXX-000 (contoh: 101-VNL-008).',
  })
  sku: string;

  @IsString({ message: 'Nama produk harus berupa teks.' })
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong.' })
  @MinLength(3, { message: 'Nama produk minimal terdiri dari 3 karakter.' })
  @MaxLength(100, { message: 'Nama produk maksimal 100 karakter.' })
  name: string;

  @IsIn(PRODUCT_CATEGORIES, {
    message: `Kategori harus salah satu dari: ${PRODUCT_CATEGORIES.join(', ')}.`,
  })
  category: ProductCategory;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Harga harus berupa angka valid (maksimal 2 angka desimal).' },
  )
  @Min(0.5, { message: 'Harga produk minimal adalah $0.50.' })
  price: number;

  @Type(() => Number)
  @IsInt({ message: 'Jumlah stok harus berupa bilangan bulat.' })
  @Min(0, { message: 'Jumlah stok tidak boleh bernilai negatif.' })
  stock: number;

  @IsOptional()
  @IsString({ message: 'Badge edisi harus berupa teks.' })
  @MaxLength(40, { message: 'Badge edisi maksimal 40 karakter.' })
  editionBadge?: string;

  @IsString({ message: 'Deskripsi produk harus berupa teks.' })
  @IsNotEmpty({ message: 'Deskripsi produk wajib diisi.' })
  @MinLength(10, {
    message: 'Deskripsi produk minimal terdiri dari 10 karakter.',
  })
  description: string;

  @IsOptional()
  @IsIn(PRODUCT_ICONS, {
    message: `Ikon harus salah satu dari: ${PRODUCT_ICONS.join(', ')}.`,
  })
  icon?: ProductIconType;

  @IsOptional()
  @IsIn(PRODUCT_THEME_COLORS, {
    message: `Warna tema harus salah satu dari: ${PRODUCT_THEME_COLORS.join(', ')}.`,
  })
  themeColor?: ProductThemeColor;

  @IsDateString(
    {},
    {
      message:
        'Tanggal rilis harus menggunakan format ISO 8601 yang valid (contoh: 2026-11-23).',
    },
  )
  releaseDate: string;

  @IsOptional()
  @IsBoolean({
    message: 'Status limited edition harus berupa boolean (true/false).',
  })
  isLimitedEdition?: boolean;
}
