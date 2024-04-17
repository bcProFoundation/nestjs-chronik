import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { ChronikClient, ChronikClientNode } from 'chronik-client';

export interface ChronikHostConfig {
  clientUrls: string | string[];
  nodeUrls: string[]
};

export interface ChronikModuleOptions {
  networks: {
    [network: string]: ChronikHostConfig;
  }
}

export interface ChronikClients {
  [network: string]: ChronikClient;
}

export interface ChronikClientNodes {
  [network: string]: ChronikClientNode;
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
