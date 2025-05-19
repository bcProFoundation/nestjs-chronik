import { Inject } from '@nestjs/common';
import { CHRONIK_CLIENTS, LEGACY_CHRONIK_CLIENTS } from '../constants';

export function InjectChronikClient(network: string) {
  const token = `${CHRONIK_CLIENTS}_${network}`;
  return Inject(token);
}

export function InjectLegacyChronikClient(network: string) {
  const token = `${LEGACY_CHRONIK_CLIENTS}_${network}`;
  return Inject(token);
}
