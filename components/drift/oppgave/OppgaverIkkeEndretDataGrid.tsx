'use client';

import { BodyShort, HStack, Link, Search, Select, VStack } from '@navikt/ds-react';
import { DataGrid } from '@navikt/ds-react/PREVIEW/DataGrid';
import { useMemo, useState } from 'react';
import type { components } from 'lib/types/generated/oppgave';
import { dataGridCollator, filtrerOgSorterRader } from 'lib/utils/dataGrid';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';

type Oppgave = components['schemas']['no.nav.aap.oppgave.drift.OppgaveIkkeEndretDto'];

function sorteringsverdi(oppgave: Oppgave, columnId: string) {
  switch (columnId) {
    case 'oppgaveId':
      return oppgave.oppgaveId;
    case 'saksnummer':
      return oppgave.saksnummer;
    case 'behandlingRef':
      return oppgave.behandlingRef;
    case 'avklaringsbehovKode':
      return mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode);
    case 'enhetForKø':
      return oppgave.enhetForKø;
    case 'opprettetTidspunkt':
      return oppgave.opprettetTidspunkt;
    case 'endretTidspunkt':
      return oppgave.endretTidspunkt;
    default:
      throw new Error(`Ukjent sorteringskolonne: ${columnId}`);
  }
}

export function filtrerOgSorterOppgaver(
  oppgaver: Oppgave[],
  søketekst: string,
  enhetFilter: string,
  sortering?: DataGrid.Table.SortEntry
) {
  return filtrerOgSorterRader(
    enhetFilter ? oppgaver.filter((oppgave) => oppgave.enhetForKø === enhetFilter) : oppgaver,
    søketekst,
    (oppgave) => [
      oppgave.oppgaveId,
      oppgave.saksnummer,
      oppgave.behandlingRef,
      oppgave.avklaringsbehovKode,
      mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode),
      oppgave.enhetForKø,
      oppgave.opprettetTidspunkt,
      formaterDatoMedTidspunktSekunderForFrontend(oppgave.opprettetTidspunkt),
      oppgave.endretTidspunkt,
      oppgave.endretTidspunkt ? formaterDatoMedTidspunktSekunderForFrontend(oppgave.endretTidspunkt) : 'Ikke endret',
    ],
    sortering,
    sorteringsverdi
  );
}

const columns: DataGrid.Columns<Oppgave> = [
  {
    id: 'oppgaveId',
    header: 'Oppgave-ID',
    isRowHeader: true,
    isSortable: true,
    bodyCell: ({ oppgaveId }) => oppgaveId,
  },
  {
    id: 'saksnummer',
    header: 'Saksnummer',
    isSortable: true,
    bodyCell: ({ saksnummer }) => (saksnummer ? <Link href={`/drift/sak/${saksnummer}`}>{saksnummer}</Link> : '-'),
  },
  {
    id: 'behandlingRef',
    header: 'Behandlingsreferanse',
    isSortable: true,
    bodyCell: ({ behandlingRef, saksnummer }) =>
      saksnummer ? (
        <Link href={`/drift/sak/${saksnummer}?behandlingref=${behandlingRef}`}>{behandlingRef}</Link>
      ) : (
        behandlingRef
      ),
  },
  {
    id: 'avklaringsbehovKode',
    header: 'Avklaringsbehov',
    isSortable: true,
    bodyCell: ({ avklaringsbehovKode }) => mapBehovskodeTilBehovstype(avklaringsbehovKode),
  },
  {
    id: 'enhetForKø',
    header: 'Enhet for kø',
    isSortable: true,
    bodyCell: ({ enhetForKø }) => enhetForKø,
  },
  {
    id: 'opprettetTidspunkt',
    header: 'Opprettet',
    isSortable: true,
    bodyCell: ({ opprettetTidspunkt }) => formaterDatoMedTidspunktSekunderForFrontend(opprettetTidspunkt),
  },
  {
    id: 'endretTidspunkt',
    header: 'Sist endret',
    isSortable: true,
    bodyCell: ({ endretTidspunkt }) =>
      endretTidspunkt ? formaterDatoMedTidspunktSekunderForFrontend(endretTidspunkt) : 'Ikke endret',
  },
];

export const OppgaverIkkeEndretDataGrid = ({ oppgaver }: { oppgaver: Oppgave[] }) => {
  const [søketekst, setSøketekst] = useState('');
  const [enhetFilter, setEnhetFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<DataGrid.Table.SortEntry[]>([
    { columnId: 'opprettetTidspunkt', direction: 'asc' },
  ]);
  const enheter = useMemo(
    () => [...new Set(oppgaver.map((oppgave) => oppgave.enhetForKø))].sort(dataGridCollator.compare),
    [oppgaver]
  );
  const visteOppgaver = useMemo(
    () => filtrerOgSorterOppgaver(oppgaver, søketekst, enhetFilter, sortOrder[0]),
    [oppgaver, søketekst, enhetFilter, sortOrder]
  );

  return (
    <VStack gap="space-16">
      <HStack gap="space-16" wrap align="end">
        <Search
          label="Søk i oppgaver"
          hideLabel={false}
          variant="simple"
          size="small"
          value={søketekst}
          onChange={setSøketekst}
          onClear={() => setSøketekst('')}
        />
        <Select
          label="Enhet for kø"
          size="small"
          value={enhetFilter}
          onChange={(event) => setEnhetFilter(event.target.value)}
        >
          <option value="">Alle enheter</option>
          {enheter.map((enhet) => (
            <option key={enhet} value={enhet}>
              {enhet}
            </option>
          ))}
        </Select>
      </HStack>
      <BodyShort size="small" aria-live="polite">
        Viser {visteOppgaver.length} av {oppgaver.length} oppgaver
      </BodyShort>
      <DataGrid
        columns={columns}
        data={visteOppgaver}
        getRowId={(oppgave) => String(oppgave.oppgaveId)}
        defaultSettings={{ rowDensity: 'tight', textSize: 'small' }}
      >
        <DataGrid.Table
          aria-label="Gamle oppgaver som ikke er endret"
          layout="auto"
          sorting={{ sortOrder, onSortOrderChange: setSortOrder, allowMultiSort: false }}
          emptyContent="Ingen oppgaver samsvarer med filtrene."
        />
      </DataGrid>
    </VStack>
  );
};
