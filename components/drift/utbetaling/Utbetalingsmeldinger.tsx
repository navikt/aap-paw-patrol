'use client';

import { Alert, BodyShort, CopyButton, Heading, Loader, Search, Table, VStack } from '@navikt/ds-react';
import { hentUtbetalingsmeldinger } from 'lib/clientApi';
import type { UtbetalingsmeldingDto } from 'lib/types/utbetaling';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { type FormEvent, useRef, useState } from 'react';
import styles from './Utbetalingsmeldinger.module.css';

function feilmeldingForStatus(status: number): string {
  if (status === 400) {
    return 'Sjekk saksnummeret og prøv igjen.';
  }
  if (status === 401) {
    return 'Innloggingen er utløpt. Logg inn på nytt.';
  }
  if (status === 403) {
    return 'Du har ikke tilgang til å se utbetalingsmeldinger.';
  }
  if (status === 404) {
    return 'Fant ingen utbetalingsmeldinger for saksnummeret.';
  }
  if (status >= 500) {
    return 'Utbetalingsmeldingene er ikke tilgjengelige akkurat nå. Prøv igjen senere.';
  }
  return 'Kunne ikke hente utbetalingsmeldinger. Prøv igjen.';
}

function formaterOpprettet(opprettet: string): string {
  try {
    return formaterDatoMedTidspunktSekunderForFrontend(opprettet);
  } catch {
    return opprettet;
  }
}

export const Utbetalingsmeldinger = () => {
  const [saksnummer, setSaksnummer] = useState('');
  const [innsendtSaksnummer, setInnsendtSaksnummer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [feltfeil, setFeltfeil] = useState<string>();
  const [feilmelding, setFeilmelding] = useState<string>();
  const [meldinger, setMeldinger] = useState<UtbetalingsmeldingDto[]>();
  const [åpneRader, setÅpneRader] = useState<Set<string>>(() => new Set());
  const forespørselId = useRef(0);

  const søk = async (value: string) => {
    const id = ++forespørselId.current;
    const trimmed = value.trim();

    setInnsendtSaksnummer(trimmed || undefined);
    setFeltfeil(trimmed ? undefined : 'Skriv inn et saksnummer.');
    setFeilmelding(undefined);
    setMeldinger(undefined);
    setÅpneRader(new Set());

    if (!trimmed) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await hentUtbetalingsmeldinger(trimmed);
      if (id !== forespørselId.current) return;

      if (!response.ok) {
        setFeilmelding(feilmeldingForStatus(response.status));
        return;
      }

      const resultat = (await response.json()) as UtbetalingsmeldingDto[];
      if (id !== forespørselId.current) return;
      setMeldinger(resultat);
    } catch {
      if (id === forespørselId.current) {
        setFeilmelding('Kunne ikke hente utbetalingsmeldinger. Prøv igjen.');
      }
    } finally {
      if (id === forespørselId.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void søk(saksnummer);
  };

  return (
    <VStack className={styles.container} gap="space-16" marginBlock="space-32">
      <Heading size="large" level="1">
        Utbetalingsmeldinger
      </Heading>

      <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
        <Search
          label="Saksnummer"
          placeholder="Skriv inn saksnummer"
          value={saksnummer}
          error={feltfeil}
          onSearchClick={søk}
          onChange={(value) => {
            setSaksnummer(value);
            if (feltfeil) setFeltfeil(undefined);
          }}
        />
      </form>

      {isLoading && (
        <div className={styles.loading} role="status" aria-live="polite">
          <Loader size="small" aria-hidden="true" />
          <BodyShort>Henter utbetalingsmeldinger for saksnummer {innsendtSaksnummer}.</BodyShort>
        </div>
      )}

      {feilmelding && (
        <Alert variant="error" size="small">
          {feilmelding}
        </Alert>
      )}

      {meldinger && meldinger.length === 0 && (
        <Alert variant="info" size="small">
          Ingen utbetalingsmeldinger funnet for saksnummer {innsendtSaksnummer}.
        </Alert>
      )}

      {meldinger && meldinger.length > 0 && (
        <>
          <BodyShort>Viser utbetalingsmeldinger for saksnummer {innsendtSaksnummer}.</BodyShort>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Utbetalingsmeldinger"
            // Focusable so keyboard users can scroll the overflow region.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Table className={styles.table} size="medium" zebraStripes>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className={styles.expandColumn} scope="col" />
                  <Table.HeaderCell className={styles.referenceHeader} scope="col">
                    Referanse
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.typeColumn} scope="col">
                    Utbetalingsmeldingstype
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.dateColumn} scope="col">
                    Opprettet
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.statusColumn} scope="col">
                    Status
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {meldinger.map((melding, index) => {
                  const rowKey = `${melding.referanse}-${melding.utbetalingsmeldingType}-${melding.opprettet}-${melding.status}-${index}`;

                  return (
                    <Table.ExpandableRow
                      key={rowKey}
                      open={åpneRader.has(rowKey)}
                      onOpenChange={(open) => {
                        setÅpneRader((current) => {
                          const next = new Set(current);
                          if (open) {
                            next.add(rowKey);
                          } else {
                            next.delete(rowKey);
                          }
                          return next;
                        });
                      }}
                      content={
                        <div
                          className={styles.messageScroll}
                          role="region"
                          aria-label={`Melding for referanse ${melding.referanse}`}
                          // Focusable so keyboard users can scroll long message content.
                          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                          tabIndex={0}
                        >
                          <pre>{melding.melding}</pre>
                        </div>
                      }
                    >
                      <Table.DataCell className={styles.referenceColumn}>
                        <div className={styles.referenceContent}>
                          <span>{melding.referanse}</span>
                          <CopyButton copyText={melding.referanse} title="Kopier referanse" size="xsmall" />
                        </div>
                      </Table.DataCell>
                      <Table.DataCell className={styles.typeColumn}>{melding.utbetalingsmeldingType}</Table.DataCell>
                      <Table.DataCell className={styles.dateColumn}>
                        {formaterOpprettet(melding.opprettet)}
                      </Table.DataCell>
                      <Table.DataCell className={styles.statusColumn}>{melding.status}</Table.DataCell>
                    </Table.ExpandableRow>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </>
      )}
    </VStack>
  );
};
