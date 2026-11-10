'use client';

import { BodyShort, Heading, Loader, LocalAlert, Table, VStack } from '@navikt/ds-react';
import { hentUtbetalingStatusAntall } from 'lib/clientApi';
import { useEffect, useState } from 'react';

const kjenteStatuser = [
  { kode: 'IKKE_SENDT', navn: 'Ikke sendt' },
  { kode: 'SENDT', navn: 'Sendt' },
  { kode: 'MOTTATT', navn: 'Mottatt' },
  { kode: 'HOS_OPPDRAG', navn: 'Hos Oppdrag' },
  { kode: 'OK', navn: 'Mottatt og godkjent' },
  { kode: 'FEILET', navn: 'Feilet' },
] as const;

const kjenteStatuskoder = new Set(kjenteStatuser.map(({ kode }) => kode));
const tallformat = new Intl.NumberFormat('nb-NO');

export interface UtbetalingStatusRad {
  kode: string;
  navn: string;
  antall: number;
}

export const byggUtbetalingStatusRader = (antallPerStatus: Record<string, number>): UtbetalingStatusRad[] => {
  const kjenteRader = kjenteStatuser.map(({ kode, navn }) => ({
    kode,
    navn,
    antall: Object.prototype.hasOwnProperty.call(antallPerStatus, kode) ? antallPerStatus[kode] : 0,
  }));
  const ukjenteRader = Object.entries(antallPerStatus)
    .filter(([kode]) => !kjenteStatuskoder.has(kode as (typeof kjenteStatuser)[number]['kode']))
    .sort(([kodeA], [kodeB]) => (kodeA < kodeB ? -1 : kodeA > kodeB ? 1 : 0))
    .map(([kode, antall]) => ({ kode, navn: kode, antall }));

  return [...kjenteRader, ...ukjenteRader];
};

const erStatuskart = (verdi: unknown): verdi is Record<string, number> =>
  typeof verdi === 'object' &&
  verdi !== null &&
  !Array.isArray(verdi) &&
  Object.values(verdi).every((antall) => typeof antall === 'number' && Number.isFinite(antall));

export const UtbetalingStatus = () => {
  const [rader, setRader] = useState<UtbetalingStatusRad[]>();
  const [tilstand, setTilstand] = useState<'laster' | 'klar' | 'feil'>('laster');

  useEffect(() => {
    let aktiv = true;

    const hentStatus = async () => {
      try {
        const response = await hentUtbetalingStatusAntall();
        if (!response.ok) {
          throw new Error('Statusforespørselen feilet');
        }

        const svar: unknown = await response.json();
        if (
          typeof svar !== 'object' ||
          svar === null ||
          Array.isArray(svar) ||
          !('antallPerStatus' in svar) ||
          !erStatuskart(svar.antallPerStatus)
        ) {
          throw new Error('Statusresponsen mangler forventede data');
        }

        if (aktiv) {
          setRader(byggUtbetalingStatusRader(svar.antallPerStatus));
          setTilstand('klar');
        }
      } catch {
        if (aktiv) {
          setRader(undefined);
          setTilstand('feil');
        }
      }
    };

    void hentStatus();

    return () => {
      aktiv = false;
    };
  }, []);

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Utbetalingsstatuser</Heading>
      <BodyShort>Antall utbetalinger per gjeldende status.</BodyShort>

      {tilstand === 'laster' && <Loader title="Henter utbetalingsstatuser" />}

      {tilstand === 'feil' && (
        <LocalAlert status="error" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title as="h2">Kunne ikke hente utbetalingsstatusene</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>Last siden på nytt for å prøve igjen.</LocalAlert.Content>
        </LocalAlert>
      )}

      {tilstand === 'klar' && rader && (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Antall utbetalinger</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rader.map((rad) => (
              <Table.Row key={rad.kode}>
                <Table.HeaderCell scope="row">{rad.navn}</Table.HeaderCell>
                <Table.DataCell>{tallformat.format(rad.antall)}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
};
