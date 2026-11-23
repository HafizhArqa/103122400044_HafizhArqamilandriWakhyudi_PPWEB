import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      application: "ONE 'O ONES Official Store API",
      assignment: 'Bab 9 - NestJS Dasar + Struktur MVC',
      status: 'running',
      endpoints: {
        listProducts: 'GET /products',
        getProduct: 'GET /products/:id',
        createProduct: 'POST /products',
        updateProduct: 'PATCH /products/:id',
        deleteProduct: 'DELETE /products/:id',
        resetSampleData: 'POST /products/reset',
      },
    };
  }
}

