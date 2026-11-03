'use client';

import { BodyShort, HStack, Link, Search, Select, VStack } from '@navikt/ds-react';
import { DataGrid } from '@navikt/ds-react/PREVIEW/DataGrid';
import { useMemo, useState } from 'react';
import type { components } from 'lib/types/generated/postmottak';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { dataGridCollator as collator, filtrerOgSorterRader } from 'lib/utils/dataGrid';

type JournalpostAvstemmingsresultat =
  components['schemas']['no.nav.aap.postmottak.api.drift.JournalpostAvstemmingsresultatDto'];

const utfallTekster = new Map<string, string>([
  ['UAVSTEMT_UKJENT', 'Uavstemt – ukjent'],
  ['UAVSTEMT_KELVIN', 'Uavstemt – Kelvin'],
  ['GOSYS_OPPGAVE_OPPRETTET', 'Gosys-oppgave opprettet'],
  ['FORDELINGSOPPGAVE_OPPRETTET', 'Fordelingsoppgave opprettet'],
  ['ALLEREDE_HAR_OPPGAVE', 'Har allerede oppgave'],
  ['IKKE_NOK_INFORMASJON', 'Ikke nok informasjon'],
]);

const utfallTilTekst = (utfall: string) => utfallTekster.get(utfall) ?? utfall;

function sorteringsverdi(resultat: JournalpostAvstemmingsresultat, columnId: string) {
  switch (columnId) {
    case 'journalpostId':
      return resultat.journalpostId;
    case 'utfall':
      return utfallTilTekst(resultat.utfall);
    case 'kanal':
      return resultat.kanal ?? null;
    case 'datoOpprettet':
      return resultat.datoOpprettet ?? null;
    default:
      throw new Error(`Ukjent sorteringskolonne: ${columnId}`);
  }
}

export function filtrerOgSorterResultater(
  resultater: JournalpostAvstemmingsresultat[],
  søketekst: string,
  utfallFilter: string,
  sortering?: DataGrid.Table.SortEntry
) {
  return filtrerOgSorterRader(
    utfallFilter ? resultater.filter((resultat) => resultat.utfall === utfallFilter) : resultater,
    søketekst,
    (resultat) => [
      resultat.journalpostId,
      resultat.utfall,
      utfallTilTekst(resultat.utfall),
      resultat.kanal ?? '',
      resultat.datoOpprettet ?? '',
      resultat.datoOpprettet ? formaterDatoForFrontend(resultat.datoOpprettet) : '',
    ],
    sortering,
    sorteringsverdi
  );
}

const columns: DataGrid.Columns<JournalpostAvstemmingsresultat> = [
  {
    id: 'journalpostId',
    header: 'Journalpost-ID',
    isRowHeader: true,
    isSortable: true,
    bodyCell: ({ journalpostId }) => <Link href={`/drift/postmottak/${journalpostId}`}>{journalpostId}</Link>,
  },
  {
    id: 'utfall',
    header: 'Utfall',
    isSortable: true,
    bodyCell: ({ utfall }) => utfallTilTekst(utfall),
  },
  {
    id: 'kanal',
    header: 'Kanal',
    isSortable: true,
    bodyCell: ({ kanal }) => kanal ?? '-',
  },
  {
    id: 'datoOpprettet',
    header: 'Dato opprettet',
    isSortable: true,
    bodyCell: ({ datoOpprettet }) => (datoOpprettet ? formaterDatoForFrontend(datoOpprettet) : '-'),
  },
];

export const JoarkAvstemmingDataGrid = ({ resultater }: { resultater: JournalpostAvstemmingsresultat[] }) => {
  const [søketekst, setSøketekst] = useState('');
  const [utfallFilter, setUtfallFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<DataGrid.Table.SortEntry[]>([]);
  const utfall = useMemo(
    () =>
      [...new Set(resultater.map((resultat) => resultat.utfall))].sort((a, b) =>
        collator.compare(utfallTilTekst(a), utfallTilTekst(b))
      ),
    [resultater]
  );
  const visteResultater = useMemo(
    () => filtrerOgSorterResultater(resultater, søketekst, utfallFilter, sortOrder[0]),
    [resultater, søketekst, utfallFilter, sortOrder]
  );

  return (
    <VStack gap="space-16">
      <HStack gap="space-16" wrap align="end">
        <Search
          label="Søk i journalposter"
          hideLabel={false}
          variant="simple"
          size="small"
          value={søketekst}
          onChange={setSøketekst}
          onClear={() => setSøketekst('')}
        />
        <Select
          label="Utfall"
          size="small"
          value={utfallFilter}
          onChange={(event) => setUtfallFilter(event.target.value)}
        >
          <option value="">Alle utfall</option>
          {utfall.map((verdi) => (
            <option key={verdi} value={verdi}>
              {utfallTilTekst(verdi)}
            </option>
          ))}
        </Select>
      </HStack>
      <BodyShort size="small" aria-live="polite">
        Viser {visteResultater.length} av {resultater.length} journalposter
      </BodyShort>
      <DataGrid
        columns={columns}
        data={visteResultater}
        getRowId={(resultat) => String(resultat.journalpostId)}
        defaultSettings={{ rowDensity: 'tight', textSize: 'small' }}
      >
        <DataGrid.Table
          aria-label="Journalposter i Joark-avstemmingsrapporten"
          layout="auto"
          sorting={{ sortOrder, onSortOrderChange: setSortOrder, allowMultiSort: false }}
          emptyContent="Ingen journalposter samsvarer med filtrene."
        />
      </DataGrid>
    </VStack>
  );
};
