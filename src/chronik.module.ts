import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  CHRONIK_CLIENTS,
  LEGACY_CHRONIK_CLIENTS,
  CHRONIK_MODULE_OPTIONS,
  CHRONIK_SUPPORT_COINS,
} from './constants';
import {
  ChronikClients,
  ChronikModuleAsyncOptions,
  ChronikModuleOptions,
  LegacyChronikClients,
} from './interfaces/chronik.interfaces';
import {
  createAsyncProviders,
  createConnectionFactory,
  createLegacyChronikClientFactory,
} from './providers/chronik.providers';

@Global()
@Module({})
export class ChronikModule {
  public static forRoot(
    options: ChronikModuleOptions,
    isGlobal = true,
  ): DynamicModule {
    const chronikOptions: Provider = {
      provide: CHRONIK_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: CHRONIK_CLIENTS,
      useFactory: async () => await createConnectionFactory(options),
    };

    const legacyClientProvider: Provider = {
      provide: LEGACY_CHRONIK_CLIENTS,
      useFactory: async () => await createLegacyChronikClientFactory(options),
    };

    const childrenProviders: Provider[] = [];
    for (const [network, chronikConfig] of Object.entries(options.networks)) {
      childrenProviders.push({
        provide: `${CHRONIK_CLIENTS}_${network}`,
        inject: [CHRONIK_CLIENTS],
        useFactory: (clients: ChronikClients) => clients[network],
      });
      childrenProviders.push({
        provide: `${LEGACY_CHRONIK_CLIENTS}_${network}`,
        inject: [LEGACY_CHRONIK_CLIENTS],
        useFactory: (clients: LegacyChronikClients) => clients[network],
      });
    }

    return {
      module: ChronikModule,
      providers: [
        chronikOptions,
        connectionProvider,
        legacyClientProvider,
        ...childrenProviders,
      ],
      exports: [connectionProvider, legacyClientProvider, ...childrenProviders],
    };
  }

  public static forRootAsync(
    options: ChronikModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    const connectionProvider: Provider = {
      provide: CHRONIK_CLIENTS,
      useFactory: async (chronikOptions: ChronikModuleOptions) =>
        await createConnectionFactory(chronikOptions),
      inject: [CHRONIK_MODULE_OPTIONS],
    };
    const legacyClientProvider: Provider = {
      provide: LEGACY_CHRONIK_CLIENTS,
      useFactory: async (chronikOptions: ChronikModuleOptions) =>
        await createLegacyChronikClientFactory(chronikOptions),
      inject: [CHRONIK_MODULE_OPTIONS],
    };

    const asyncProviders = createAsyncProviders(options);

    const childrenProviders: Provider[] = [];
    for (const network of CHRONIK_SUPPORT_COINS) {
      childrenProviders.push({
        provide: `${CHRONIK_CLIENTS}_${network}`,
        inject: [CHRONIK_CLIENTS, CHRONIK_MODULE_OPTIONS],
        useFactory: (
          clients: ChronikClients,
          chronikOptions: ChronikModuleOptions,
        ) => {
          if (chronikOptions.networks[network]) {
            return clients[network];
          }
        },
      });
      childrenProviders.push({
        provide: `${LEGACY_CHRONIK_CLIENTS}_${network}`,
        inject: [LEGACY_CHRONIK_CLIENTS, CHRONIK_MODULE_OPTIONS],
        useFactory: (
          clients: LegacyChronikClients,
          chronikOptions: ChronikModuleOptions,
        ) => {
          if (chronikOptions.networks[network]) {
            return clients[network];
          }
        },
      });
    }

    return {
      global: isGlobal,
      module: ChronikModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        connectionProvider,
        legacyClientProvider,
        ...childrenProviders.filter((x) => !!x),
      ],
      exports: [
        connectionProvider,
        legacyClientProvider,
        ...childrenProviders.filter((x) => !!x),
      ],
    };
  }
}
