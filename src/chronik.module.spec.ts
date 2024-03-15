import { DynamicModule } from '@nestjs/common';
import { CHRONIK_MODULE_OPTIONS } from './constants';
import { ChronikModule } from './chronik.module';

describe('ChronikModule', () => {
  it('should validate that module exists', async () => {
    expect(ChronikModule).toBeDefined();
  });

  it('should register the module with options', async () => {
    const registeredModule: DynamicModule = ChronikModule.forRoot({
      host: 'http://127.0.0.1',
      networks: ['xec', 'xpi', 'xrg', 'bch']
    });

    expect(registeredModule).toBeDefined();
    expect(typeof registeredModule.module).toBeDefined();
    expect(registeredModule.providers.length).toBeGreaterThan(0);
    const chronikOptionsProvider: any = registeredModule.providers[0];
    expect(chronikOptionsProvider.provide).toBe(CHRONIK_MODULE_OPTIONS);
    expect(chronikOptionsProvider.useValue).toBeDefined();
  });

  it('should register the module with async options', async () => {
    const registeredModule: DynamicModule = ChronikModule.forRootAsync({
      useFactory: () => ({
        host: 'http://127.0.0.1',
        networks: ['xec', 'xpi', 'xrg', 'bch']
      }),
    });

    expect(registeredModule).toBeDefined();
    expect(typeof registeredModule.module).toBeDefined();
    expect(registeredModule.providers.length).toBeGreaterThan(0);
    const optionsProvider: any = registeredModule.providers[0];
    expect(optionsProvider.provide).toBe(CHRONIK_MODULE_OPTIONS);
    expect(optionsProvider.useFactory).toBeDefined();
    expect(optionsProvider.inject).toBeDefined();
  });
});
