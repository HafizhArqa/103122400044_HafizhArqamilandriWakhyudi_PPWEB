import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined with 7 initial seeded products', () => {
    expect(service).toBeDefined();
    expect(service.findAll()).toHaveLength(7);
  });

  it('should create, findOne, update, and remove a product', () => {
    const created = service.create({
      sku: '101-VNL-008',
      name: 'Ocean Echoes Acoustic Sessions EP Vinyl',
      category: 'Vinyl',
      price: 42.5,
      stock: 15,
      editionBadge: 'Signed Pressing',
      description:
        'Edisi piringan hitam akustik bertanda tangan dengan bonus poster tur eksklusif.',
      icon: 'sparkles',
      releaseDate: '2026-11-23',
      isLimitedEdition: true,
    });

    expect(created.id).toBe(8);
    expect(service.findOne(8).sku).toBe('101-VNL-008');

    const updated = service.update(8, { price: 45, stock: 10 });
    expect(updated.price).toBe(45);
    expect(updated.stock).toBe(10);

    const removed = service.remove(8);
    expect(removed.deletedProduct.id).toBe(8);
    expect(() => service.findOne(8)).toThrow(NotFoundException);
  });

  it('should throw ConflictException on duplicate SKU or name', () => {
    expect(() =>
      service.create({
        sku: '101-VNL-001',
        name: 'Unique New Product Name',
        category: 'Vinyl',
        price: 30,
        stock: 5,
        description: 'Produk uji duplikasi SKU yang sudah terdaftar.',
        releaseDate: '2026-11-23',
      }),
    ).toThrow(ConflictException);
  });

  it('should throw NotFoundException when ID does not exist', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
    expect(() => service.remove(999)).toThrow(NotFoundException);
  });

  it('should throw BadRequestException when update payload is empty', () => {
    expect(() => service.update(1, {})).toThrow(BadRequestException);
  });
});
