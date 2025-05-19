import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { ChronikClient } from 'chronik-client';
import { ChronikClient as LegacyChronikClient } from 'legacy-chronik-client';

export interface ChronikHostConfig {
  clientUrls: string[];
}

export interface ChronikModuleOptions {
  networks: {
    [network: string]: ChronikHostConfig;
  };
}

export interface ChronikClients {
  [network: string]: ChronikClient;
}

export interface LegacyChronikClients {
  [network: string]: LegacyChronikClient;
}

export interface ChronikModuleOptionsFactory {
  createChronikOptions(): Promise<ChronikModuleOptions> | ChronikModuleOptions;
}

export interface ChronikModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ChronikModuleOptionsFactory>;
  useClass?: Type<ChronikModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ChronikModuleOptions> | ChronikModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
