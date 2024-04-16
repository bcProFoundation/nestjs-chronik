import { Inject } from '@nestjs/common';
import { CHRONIK_CLIENTS, CHRONIK_CLIENT_NODES } from '../constants';

export function InjectChronikClient(network: string) {
  const token = `${CHRONIK_CLIENTS}_${network}`;
  return Inject(token);
}

export function InjectChronikClientNode(network: string) {
  const token = `${CHRONIK_CLIENT_NODES}_${network}`;
  return Inject(token);
}
