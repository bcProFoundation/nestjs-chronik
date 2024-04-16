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
      host: 'https://chronik.be.cash',
      networks: ['xec', 'xpi', 'xrg', 'bch']
    }),
  ],

  // or async
  ChronikModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      host: config.get<string>('CHRONIK_URL') || 'https://chronik.be.cash',
      networks: ['xec', 'xpi', 'xrg', 'bch']
    }),
  }),
})
export class AppModule {}
```

use `@InjectChronikClient()` decorator in any injectables to get a `ChronikClient` client inside class

```typescript
import { Injectable } from '@nestjs/common';
import { InjectChronikClient } from 'nestjs-chronik';
import { ChronikClient } from 'chronik-client';
@Injectable()
export class TestService {
  public constructor(
    @InjectChronikClient('xec') private readonly chronikXec: ChronikClient,
  ) {}
}
```

## Author

** Vince Tran ([Lixi](https://lixi.social/profile/lotus_16PSJMhnYSpfkeNLMjZVdyoLZ9wbk4CcQGFhaaw2Z))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
