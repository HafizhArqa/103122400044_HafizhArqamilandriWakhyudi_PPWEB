import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import {
  Product,
  type ProductCategory,
  type ProductThemeColor,
} from './entities/product.entity.js';

const INITIAL_PRODUCTS_SEED: Product[] = [
  {
    id: 1,
    sku: '101-VNL-001',
    name: 'Astral Horizon Heavyweight Gold 180g Vinyl',
    category: 'Vinyl',
    price: 36,
    stock: 12,
    editionBadge: 'Bold Edition',
    description:
      'Piringan hitam 180g audiophile gold-marbled dengan gatefold jacket eksklusif dan lyric booklet.',
    icon: 'disc',
    themeColor: 'amber',
    releaseDate: '2026-03-14',
    isLimitedEdition: true,
    createdAt: '2026-03-14T10:00:00.000Z',
    updatedAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 2,
    sku: '101-VNL-002',
    name: '8-Bit Odyssey Chiptune Hologram Vinyl',
    category: 'Vinyl',
    price: 34,
    stock: 8,
    editionBadge: 'Retro Pixel',
    description:
      'Vinyl berdesain hologram dengan 12 trek chiptune synthesizer dan cover art bergaya arcade retro.',
    icon: 'cube',
    themeColor: 'cyan',
    releaseDate: '2026-05-02',
    isLimitedEdition: true,
    createdAt: '2026-05-02T10:00:00.000Z',
    updatedAt: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 3,
    sku: '101-VNL-003',
    name: 'Ocean Lullaby Aqua Swirl Vinyl Edition',
    category: 'Vinyl',
    price: 38,
    stock: 5,
    editionBadge: 'Bioluminescent',
    description:
      'Edisi swirl aqua laut dengan efek glow-in-the-dark pada vinyl sleeve dan art print bernomor seri.',
    icon: 'globe',
    themeColor: 'teal',
    releaseDate: '2026-06-19',
    isLimitedEdition: true,
    createdAt: '2026-06-19T10:00:00.000Z',
    updatedAt: '2026-06-19T10:00:00.000Z',
  },
  {
    id: 4,
    sku: '101-CST-004',
    name: 'Analog Sessions Demo Cassette Tape',
    category: 'Cassette',
    price: 18,
    stock: 20,
    editionBadge: 'Vintage Tape',
    description:
      'Kaset pita analog C-60 smokey tint berisi demo rekaman live studio dan unreleased rehearsal tracks.',
    icon: 'cassette',
    themeColor: 'purple',
    releaseDate: '2026-07-08',
    isLimitedEdition: false,
    createdAt: '2026-07-08T10:00:00.000Z',
    updatedAt: '2026-07-08T10:00:00.000Z',
  },
  {
    id: 5,
    sku: '101-APR-005',
    name: 'Astral Horizon Monogram Heavyweight Tee',
    category: 'Apparel',
    price: 32,
    stock: 25,
    editionBadge: 'Official Merch',
    description:
      "Kaos 240gsm 100% heavy cotton comb dengan sablon puff print logo ONE 'O ONES dan jadwal tur dunia.",
    icon: 'apparel',
    themeColor: 'amber',
    releaseDate: '2026-08-21',
    isLimitedEdition: false,
    createdAt: '2026-08-21T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z',
  },
  {
    id: 6,
    sku: '101-APR-006',
    name: '8-Bit Neon Arcade Oversized Hoodie',
    category: 'Apparel',
    price: 58,
    stock: 14,
    editionBadge: 'Limited Edition',
    description:
      'Hoodie fleece tebal bernuansa cyber-neon dengan bordir pixel font di lengan dan dada.',
    icon: 'bolt',
    themeColor: 'cyan',
    releaseDate: '2026-09-12',
    isLimitedEdition: true,
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 7,
    sku: '101-CLB-007',
    name: 'Ocean Depths Metallic Enamel Pin Set',
    category: 'Collectible',
    price: 15,
    stock: 30,
    editionBadge: 'Special Pack',
    description:
      'Set 4 pin enamel logam keras bergambar ikon lumba-lumba cyber dan gelombang suara analog.',
    icon: 'star',
    themeColor: 'teal',
    releaseDate: '2026-10-04',
    isLimitedEdition: false,
    createdAt: '2026-10-04T10:00:00.000Z',
    updatedAt: '2026-10-04T10:00:00.000Z',
  },
];

@Injectable()
export class ProductsService {
  // Penyimpanan sementara di memori (in-memory array) sesuai materi Bab 9
  private products: Product[] = INITIAL_PRODUCTS_SEED.map((item) =>
    Object.assign(new Product(), item),
  );
  private nextId = INITIAL_PRODUCTS_SEED.length + 1;

  private resolveThemeColor(category: ProductCategory): ProductThemeColor {
    switch (category) {
      case 'Vinyl':
        return 'amber';
      case 'Cassette':
        return 'purple';
      case 'Apparel':
        return 'teal';
      case 'Collectible':
        return 'pink';
      default:
        return 'cyan';
    }
  }

  /**
   * CREATE: Menambahkan produk merchandise baru ke dalam array memori.
   * Melempar ConflictException (409) jika SKU atau nama produk sudah terdaftar.
   */
  create(createProductDto: CreateProductDto): Product {
    const normalizedSku = createProductDto.sku.trim().toUpperCase();
    const normalizedName = createProductDto.name.trim();

    const duplicateSku = this.products.find(
      (item) => item.sku.toUpperCase() === normalizedSku,
    );
    if (duplicateSku) {
      throw new ConflictException(
        `Produk dengan SKU "${normalizedSku}" sudah terdaftar di katalog ONE 'O ONES.`,
      );
    }

    const duplicateName = this.products.find(
      (item) => item.name.toLowerCase() === normalizedName.toLowerCase(),
    );
    if (duplicateName) {
      throw new ConflictException(
        `Produk dengan nama "${normalizedName}" sudah ada di katalog.`,
      );
    }

    const now = new Date().toISOString();
    const newProduct = Object.assign(new Product(), {
      id: this.nextId++,
      sku: normalizedSku,
      name: normalizedName,
      category: createProductDto.category,
      price: createProductDto.price,
      stock: createProductDto.stock,
      editionBadge: createProductDto.editionBadge?.trim() || 'Official Release',
      description: createProductDto.description.trim(),
      icon: createProductDto.icon ?? 'disc',
      themeColor:
        createProductDto.themeColor ??
        this.resolveThemeColor(createProductDto.category),
      releaseDate: createProductDto.releaseDate,
      isLimitedEdition: createProductDto.isLimitedEdition ?? false,
      createdAt: now,
      updatedAt: now,
    });

    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * READ (ALL): Mengambil seluruh daftar produk, dengan dukungan opsional query filter category & search.
   */
  findAll(category?: string, search?: string): Product[] {
    return this.products.filter((item) => {
      const matchesCategory =
        !category ||
        category === 'Semua' ||
        item.category.toLowerCase() === category.toLowerCase();

      const keyword = search?.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.sku.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.editionBadge.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }

  /**
   * READ (ONE): Mengambil satu detail produk berdasarkan ID.
   * Melempar NotFoundException (404) apabila ID tidak ditemukan.
   */
  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException(
        `Produk merchandise dengan ID #${id} tidak ditemukan di katalog.`,
      );
    }
    return product;
  }

  /**
   * UPDATE: Memperbarui sebagian atau seluruh data produk berdasarkan ID.
   * Melempar BadRequestException (400) jika body kosong,
   * NotFoundException (404) jika ID tidak ditemukan,
   * dan ConflictException (409) jika SKU/nama bentrok dengan produk lain.
   */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException(
        'Minimal satu field harus dikirim untuk memperbarui data produk.',
      );
    }

    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Gagal memperbarui: produk dengan ID #${id} tidak ditemukan.`,
      );
    }

    const existing = this.products[index];

    if (updateProductDto.sku !== undefined) {
      const normalizedSku = updateProductDto.sku.trim().toUpperCase();
      const duplicateSku = this.products.find(
        (item) => item.id !== id && item.sku.toUpperCase() === normalizedSku,
      );
      if (duplicateSku) {
        throw new ConflictException(
          `SKU "${normalizedSku}" sudah digunakan oleh produk lain (#${duplicateSku.id}).`,
        );
      }
    }

    if (updateProductDto.name !== undefined) {
      const normalizedName = updateProductDto.name.trim();
      const duplicateName = this.products.find(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() === normalizedName.toLowerCase(),
      );
      if (duplicateName) {
        throw new ConflictException(
          `Nama produk "${normalizedName}" sudah digunakan oleh produk lain (#${duplicateName.id}).`,
        );
      }
    }

    const nextCategory = updateProductDto.category ?? existing.category;
    const updatedProduct = Object.assign(new Product(), existing, {
      id: existing.id,
      sku:
        updateProductDto.sku !== undefined
          ? updateProductDto.sku.trim().toUpperCase()
          : existing.sku,
      name:
        updateProductDto.name !== undefined
          ? updateProductDto.name.trim()
          : existing.name,
      category: nextCategory,
      price: updateProductDto.price ?? existing.price,
      stock: updateProductDto.stock ?? existing.stock,
      editionBadge:
        updateProductDto.editionBadge !== undefined
          ? updateProductDto.editionBadge.trim() || 'Official Release'
          : existing.editionBadge,
      description:
        updateProductDto.description !== undefined
          ? updateProductDto.description.trim()
          : existing.description,
      icon: updateProductDto.icon ?? existing.icon,
      themeColor:
        updateProductDto.themeColor ??
        (updateProductDto.category
          ? this.resolveThemeColor(nextCategory)
          : existing.themeColor),
      releaseDate: updateProductDto.releaseDate ?? existing.releaseDate,
      isLimitedEdition:
        updateProductDto.isLimitedEdition ?? existing.isLimitedEdition,
      updatedAt: new Date().toISOString(),
    });

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  /**
   * DELETE: Menghapus satu produk berdasarkan ID.
   * Melempar NotFoundException (404) jika ID tidak ditemukan.
   */
  remove(id: number): { message: string; deletedProduct: Product } {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Gagal menghapus: produk dengan ID #${id} tidak ditemukan.`,
      );
    }

    const [deletedProduct] = this.products.splice(index, 1);
    return {
      message: `Produk "${deletedProduct.name}" (ID #${id}) berhasil dihapus dari katalog.`,
      deletedProduct,
    };
  }

  /**
   * Utility: Mengembalikan array ke 7 data sampel awal untuk kebutuhan pengujian UI.
   */
  reset(): { message: string; total: number; data: Product[] } {
    this.products = INITIAL_PRODUCTS_SEED.map((item) =>
      Object.assign(new Product(), item),
    );
    this.nextId = INITIAL_PRODUCTS_SEED.length + 1;
    return {
      message: 'Data katalog berhasil direset ke 7 produk sampel awal.',
      total: this.products.length,
      data: this.products,
    };
  }

  /**
   * Utility: Mengosongkan seluruh produk untuk pengujian conditional rendering pada frontend.
   */
  clearAll(): { message: string; removedCount: number } {
    const removedCount = this.products.length;
    this.products = [];
    return {
      message: `Seluruh data katalog (${removedCount} produk) berhasil dikosongkan.`,
      removedCount,
    };
  }
}
