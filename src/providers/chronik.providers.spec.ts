import {
  createChronikClientNodeFactory,
  createConnectionFactory,
} from '../providers/chronik.providers';
import { ChronikClient, ChronikClientNode } from 'chronik-client';

describe('when called', () => {
  it('it should provide chronik client', () => {
    const connectionProvider = createConnectionFactory({
      host: 'http://127.0.0.1',
      networks: ['xec', 'xpi', 'xrg', 'bch'],
    });
    expect(connectionProvider).toBeDefined();
    for (const connection of Object.values(connectionProvider)) {
      expect(connection).toBeInstanceOf(ChronikClient);
    }
  });
  it('it should provide chronik client node', () => {
    const clientNodeProvider = createChronikClientNodeFactory({
      host: 'http://127.0.0.1',
      networks: ['xec', 'xpi', 'xrg', 'bch'],
    });
    expect(clientNodeProvider).toBeDefined();
    for (const connection of Object.values(clientNodeProvider)) {
      expect(connection).toBeInstanceOf(ChronikClientNode);
    }
  });
});
