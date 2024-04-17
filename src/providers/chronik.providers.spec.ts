import {
  createChronikClientNodeFactory,
  createConnectionFactory,
} from '../providers/chronik.providers';
import { ChronikClient, ChronikClientNode } from 'chronik-client';

describe('when called', () => {
  it('it should provide chronik client', () => {
    const connectionProvider = createConnectionFactory({
      networks: {
        xec: {
          clientUrls: 'https://chronik.be.cash',
          nodeUrls: ['https://chronik.be.cash', 'https://chronik.pay2stay.com']
        }
      } 
    });
    expect(connectionProvider).toBeDefined();
    for (const connection of Object.values(connectionProvider)) {
      expect(connection).toBeInstanceOf(ChronikClient);
    }
  });
  it('it should provide chronik client node', () => {
    const clientNodeProvider = createChronikClientNodeFactory({
      networks: {
        xec: {
          clientUrls: 'https://chronik.be.cash',
          nodeUrls: ['https://chronik.be.cash', 'https://chronik.pay2stay.com']
        }
      } 
    });
    expect(clientNodeProvider).toBeDefined();
    for (const connection of Object.values(clientNodeProvider)) {
      expect(connection).toBeInstanceOf(ChronikClientNode);
    }
  });
});
