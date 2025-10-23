import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return health status', () => {
    const response = controller.check();
    expect(response.status).toBe('ok');
  });

  it('should return readiness status', () => {
    const response = controller.ready();
    expect(response.status).toBe('ready');
  });
});
