import {
  createConnectionFactory,
  createLegacyChronikClientFactory,
} from '../providers/chronik.providers';
import { ChronikClient } from 'chronik-client';
import { ChronikClient as LegacyChronikClient } from 'legacy-chronik-client';

describe('when called', () => {
  it('it should provide chronik client', () => {
    const connectionProvider = createConnectionFactory({
      networks: {
        xec: {
          clientUrls: ['https://chronik.be.cash/xec'],
        },
      },
    });
    expect(connectionProvider).toBeDefined();
    for (const connection of Object.values(connectionProvider)) {
      expect(connection).toBeInstanceOf(ChronikClient);
    }
  });
  it('it should provide legacy chronik client', () => {
    const legacyClientProvider = createLegacyChronikClientFactory({
      networks: {
        xpi: {
          clientUrls: ['https://chronik01.abcpay.cash/xpi'],
        },
      },
    });
    expect(legacyClientProvider).toBeDefined();
    for (const connection of Object.values(legacyClientProvider)) {
      expect(connection).toBeInstanceOf(LegacyChronikClient);
    }
  });
});
