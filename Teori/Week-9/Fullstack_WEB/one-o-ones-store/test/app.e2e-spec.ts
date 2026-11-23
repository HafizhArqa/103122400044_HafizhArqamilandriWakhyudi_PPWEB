import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Products API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / should return API info', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.application).toBe("ONE 'O ONES Official Store API");
      });
  });

  it('GET /products should return 7 seeded products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(7);
      });
  });

  it('POST -> GET -> PATCH -> DELETE /products full lifecycle', async () => {
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        sku: '101-VNL-008',
        name: 'Ocean Echoes Acoustic Sessions EP Vinyl',
        category: 'Vinyl',
        price: 42.5,
        stock: 15,
        editionBadge: 'Signed Pressing',
        description:
          'Piringan hitam 180g sesi akustik live dengan sleeve hologram dan lyric sheet eksklusif.',
        icon: 'sparkles',
        releaseDate: '2026-11-23',
        isLimitedEdition: true,
      })
      .expect(201);

    expect(created.body.id).toBe(8);

    await request(app.getHttpServer())
      .get('/products/8')
      .expect(200)
      .expect((res) => {
        expect(res.body.sku).toBe('101-VNL-008');
      });

    await request(app.getHttpServer())
      .patch('/products/8')
      .send({ price: 45, stock: 10 })
      .expect(200)
      .expect((res) => {
        expect(res.body.price).toBe(45);
        expect(res.body.stock).toBe(10);
      });

    await request(app.getHttpServer()).delete('/products/8').expect(200);
    await request(app.getHttpServer()).get('/products/8').expect(404);
  });

  it('should return 404 NotFoundException, 409 ConflictException, and 400 BadRequestException', async () => {
    await request(app.getHttpServer()).get('/products/999').expect(404);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        sku: '101-VNL-001',
        name: 'Duplicate SKU Test',
        category: 'Vinyl',
        price: 35,
        stock: 10,
        description: 'Produk uji konflik SKU duplikat.',
        releaseDate: '2026-11-23',
      })
      .expect(409);

    await request(app.getHttpServer())
      .post('/products')
      .send({
        sku: 'BAD',
        name: 'AB',
        category: 'InvalidCat',
        price: -5,
        stock: -1,
        description: 'Pendek',
        releaseDate: 'not-a-date',
      })
      .expect(400);
  });
});

