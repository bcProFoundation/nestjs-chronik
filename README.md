## About

This package is a simple wrapper around [chronik-client] for Nestjs(https://www.npmjs.com/package/chronik-client).

## Installation

This package requires `chronik-client` dependency to work.

```bash
yarn add chronik-client nestjs-chronik
```

## Getting Started

The simplest way to use `nestjs-chronik` is to use `ChronikModule.forRoot` or `ChronikModule.forRootAsync`

```typescript
import { Module } from '@nestjs-common';
import { ChronikModule } from 'nestjs-chronik';

@Module({
  imports: [
    ChronikModule.forRoot({
      networks: {
        xec: {
          clientUrls: ['https://chronik.be.cash/xec'],
        }
      }
    }),
  ],

  // or async
  ChronikModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      host: config.get<string>('CHRONIK_URL') || 'https://chronik.be.cash',
      networks: ['xec', 'xpi', 'xrg', 'bch']
      networks: {
        xec: {
          clientUrls: [config.get<string>('CHRONIK_URL') || 'https://chronik.be.cash'],
        }
      }
    }),
  }),
})
export class AppModule {}
```

For legacy chronik nodes (xpi, xrg), we need to use chronik-client version lower than 0.26.0

```package.json
"dependencies": {
  "legacy-chronik-client": "npm:chronik-client@0.26.0"
},
```

use `@InjectChronikClient() and @InjectLegacyChronikClient()` decorator in any injectables to get a `ChronikClient and LegacyChronikClient` client inside class

```typescript
import { Injectable } from '@nestjs/common';
import { InjectChronikClient } from 'nestjs-chronik';
import { ChronikClient } from 'chronik-client';
import { ChronikClient as LegacyChronikClient } from 'legacy-chronik-client';
@Injectable()
export class TestService {
  public constructor(
    @InjectChronikClient('xec') private readonly chronikXec: ChronikClient,
    @InjectLegacyChronikClient('xpi')
    private readonly chronikXpi: LegacyChronikClient,
  ) {}
}
```

## Author

** Vince Tran ([Lixi](https://lixi.social/profile/lotus_16PSJMhnYSpfkeNLMjZVdyoLZ9wbk4CcQGFhaaw2Z))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
