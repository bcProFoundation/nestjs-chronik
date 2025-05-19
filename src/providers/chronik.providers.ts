import {
  ChronikClients,
  ChronikModuleAsyncOptions,
  ChronikModuleOptions,
  ChronikModuleOptionsFactory,
  LegacyChronikClients,
} from '../interfaces/chronik.interfaces';
import { ChronikClient } from 'chronik-client';
import { ChronikClient as LegacyChronikClient } from 'legacy-chronik-client';
import { Provider, Type } from '@nestjs/common';
import { CHRONIK_MODULE_OPTIONS } from '../constants';

export function createConnectionFactory(
  options: ChronikModuleOptions,
): ChronikClients {
  const clients: { [network: string]: ChronikClient } = {};
  for (const [network, config] of Object.entries(options.networks)) {
    const chronikClient = new ChronikClient(config.clientUrls);
    clients[network] = chronikClient;
  }
  return clients;
}

export function createLegacyChronikClientFactory(
  options: ChronikModuleOptions,
): LegacyChronikClients {
  const clients: { [network: string]: LegacyChronikClient } = {};
  for (const [network, config] of Object.entries(options.networks)) {
    const client = new LegacyChronikClient(config.clientUrls);
    clients[network] = client;
  }
  return clients;
}

export function createAsyncProviders(
  options: ChronikModuleAsyncOptions,
): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options)];
  }
  const useClass = options.useClass as Type<ChronikModuleOptionsFactory>;
  return [
    createAsyncOptionsProvider(options),
    {
      provide: useClass,
      useClass,
    },
  ];
}

export function createAsyncOptionsProvider(
  options: ChronikModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: CHRONIK_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
  return {
    provide: CHRONIK_MODULE_OPTIONS,
    useFactory: async (optionsFactory: ChronikModuleOptionsFactory) =>
      await optionsFactory.createChronikOptions(),
    inject: [
      (options.useClass ||
        options.useExisting) as Type<ChronikModuleOptionsFactory>,
    ],
  };
}
