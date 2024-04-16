import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  CHRONIK_CLIENTS,
  CHRONIK_CLIENT_NODES,
  CHRONIK_MODULE_OPTIONS,
  CHRONIK_SUPPORT_COINS,
} from './constants';
import {
  ChronikClientNodes,
  ChronikClients,
  ChronikModuleAsyncOptions,
  ChronikModuleOptions,
} from './interfaces/chronik.interfaces';
import {
  createAsyncProviders,
  createChronikClientNodeFactory,
  createConnectionFactory,
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

    const clientNodesProvider: Provider = {
      provide: CHRONIK_CLIENT_NODES,
      useFactory: async () => await createChronikClientNodeFactory(options),
    };

    const childrenProviders: Provider[] = [];
    for (const network of options.networks) {
      childrenProviders.push({
        provide: `${CHRONIK_CLIENTS}_${network}`,
        inject: [CHRONIK_CLIENTS],
        useFactory: (clients: ChronikClients) => clients[network],
      });
      childrenProviders.push({
        provide: `${CHRONIK_CLIENT_NODES}_${network}`,
        inject: [CHRONIK_CLIENT_NODES],
        useFactory: (nodes: ChronikClientNodes) => nodes[network],
      });
    }

    return {
      module: ChronikModule,
      providers: [chronikOptions, connectionProvider, clientNodesProvider, ...childrenProviders],
      exports: [connectionProvider, clientNodesProvider, ...childrenProviders],
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
    const clientNodesProvider: Provider = {
      provide: CHRONIK_CLIENT_NODES,
      useFactory: async (chronikOptions: ChronikModuleOptions) =>
        await createChronikClientNodeFactory(chronikOptions),
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
          if (chronikOptions.networks.includes(network)) {
            return clients[network];
          }
        },
      });
      childrenProviders.push({
        provide: `${CHRONIK_CLIENT_NODES}_${network}`,
        inject: [CHRONIK_CLIENT_NODES, CHRONIK_MODULE_OPTIONS],
        useFactory: (
          nodes: ChronikClientNodes,
          chronikOptions: ChronikModuleOptions,
        ) => {
          if (chronikOptions.networks.includes(network)) {
            return nodes[network];
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
        clientNodesProvider,
        ...childrenProviders.filter((x) => !!x),
      ],
      exports: [connectionProvider, clientNodesProvider, ...childrenProviders.filter((x) => !!x)],
    };
  }
}
