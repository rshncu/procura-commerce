import * as path from 'path';
import { of } from 'rxjs';
import { Verifier } from '@pact-foundation/pact';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../app/app.module';

const TEST_PORT = 4300;
const TEST_JWT_SECRET = 'pact-test-secret';

describe('API Gateway - Pact provider verification (orders)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Must match the secret JwtStrategy validates against (api-gateway/src/auth/jwt.strategy.ts reads process.env.JWT_SECRET).
    process.env.JWT_SECRET = TEST_JWT_SECRET;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('PRODUCT_SERVICE')
      .useValue({ send: () => of({}) })
      .overrideProvider('ORDER_SERVICE')
      .useValue({ send: () => of({ id: 'stubbed-order-id' }) })
      .compile();

    app = moduleRef.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(TEST_PORT);
  });

  afterAll(async () => {
    await app.close();
  });

  it('validates the expectations of procura-frontend', () => {
    const testToken = new JwtService({ secret: TEST_JWT_SECRET }).sign({
      sub: 1,
      username: 'pact-test-user',
    });

    return new Verifier({
      provider: 'procura-api-gateway',
      providerBaseUrl: `http://localhost:${TEST_PORT}`,
      pactUrls: [
        path.resolve(__dirname, '..', '..', '..', 'frontend', 'pact', 'pacts', 'procura-frontend-procura-api-gateway.json'),
      ],
      requestFilter: (req: any, _res: any, next: any) => {
        req.headers['authorization'] = `Bearer ${testToken}`;
        next();
      },
    }).verifyProvider();
  });
});
