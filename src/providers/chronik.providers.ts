import {
  ChronikClientNodes,
  ChronikClients,
  ChronikModuleAsyncOptions,
  ChronikModuleOptions,
  ChronikModuleOptionsFactory,
} from '../interfaces/chronik.interfaces';
import { ChronikClient, ChronikClientNode } from 'chronik-client';
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

export function createChronikClientNodeFactory(
  options: ChronikModuleOptions,
): ChronikClientNodes {
  const nodes: { [network: string]: ChronikClientNode } = {};
  for (const [network, config] of Object.entries(options.networks)) {
    const node = new ChronikClientNode(config.nodeUrls);
    nodes[network] = node;
  }
  return nodes;
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
