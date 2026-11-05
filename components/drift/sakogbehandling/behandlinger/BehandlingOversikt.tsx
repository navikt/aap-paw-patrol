import { BodyShort, Box, Heading, type SortState, Table } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
import { FetchJsonBody, hentSakDriftsinfo } from 'lib/clientApi';
import { useSearchParams } from 'next/navigation';
import { SakQueryParam } from 'components/drift/sakogbehandling/SakOversikt.tsx';
import { BehandlingVisningPanel } from 'components/drift/sakogbehandling/behandlinger/BehandlingVisningPanel.tsx';
import { BehandlingTableRow } from 'components/drift/sakogbehandling/behandlinger/BehandlingTableRow.tsx';

export type BehandlingDriftsinfo = FetchJsonBody<ReturnType<typeof hentSakDriftsinfo>>['behandlinger'][number];

export const BehandlingOversikt = ({
  saksnummer,
  behandlinger,
}: {
  saksnummer: string;
  behandlinger: BehandlingDriftsinfo[];
}) => {
  const searchParams = useSearchParams();

  const [valgtBehandling, setValgtBehandling] = useState<BehandlingDriftsinfo>();
  const [sort, setSort] = useState<SortState | undefined>({ orderBy: 'opprettet', direction: 'descending' });

  const handleSortChange = (sortKey: string) => {
    setSort((currentSort) => {
      if (currentSort?.orderBy !== sortKey) {
        return { orderBy: sortKey, direction: 'ascending' };
      }
      if (currentSort.direction === 'ascending') {
        return { orderBy: sortKey, direction: 'descending' };
      }
      return undefined;
    });
  };

  const sorterteBehandlinger = [...behandlinger].sort((a, b) => {
    if (!sort) {
      return 0;
    }
    const verdi = (behandling: BehandlingDriftsinfo) =>
      sort.orderBy === 'vedtatt' ? (behandling.vedtatt ?? '') : behandling.opprettet;

    const sammenligning = verdi(a).localeCompare(verdi(b));
    return sort.direction === 'descending' ? -sammenligning : sammenligning;
  });

  const oppdaterValgtBehandling = useCallback((behandling?: BehandlingDriftsinfo) => {
    const url = new URL(window.location.href);
    if (behandling) {
      url.searchParams.set(SakQueryParam.BEHANDLINGREF, behandling.referanse);
    } else {
      url.searchParams.delete(SakQueryParam.BEHANDLINGREF);
    }
    window.history.replaceState(null, '', url);
    setValgtBehandling(behandling);
  }, []);

  useEffect(() => {
    if (behandlinger?.length === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      oppdaterValgtBehandling(behandlinger[0]);
    } else if (searchParams.get(SakQueryParam.BEHANDLINGREF)) {
      const behandling = behandlinger.find((b) => b.referanse === searchParams.get(SakQueryParam.BEHANDLINGREF));
      oppdaterValgtBehandling(behandling);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlinger, oppdaterValgtBehandling]);

  return (
    <Box margin="space-16">
      {!behandlinger?.length ? (
        <BodyShort>Ingen behandlinger funnet for saksnummer {saksnummer}</BodyShort>
      ) : (
        <Box
          background="neutral-soft"
          padding="space-16"
          borderRadius="16"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <Heading size="medium" textColor="subtle">
            Alle behandlinger ({behandlinger.length})
          </Heading>

          <Table size="small" sort={sort} onSortChange={handleSortChange}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Referanse</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
                <Table.HeaderCell>Årsak til opprettelse</Table.HeaderCell>
                <Table.ColumnHeader sortKey="opprettet" sortable>
                  Opprettet
                </Table.ColumnHeader>
                <Table.HeaderCell style={{ width: '2rem' }} />
                <Table.ColumnHeader sortKey="vedtatt" sortable>
                  Vedtatt
                </Table.ColumnHeader>
                <Table.HeaderCell style={{ width: '2rem' }} />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {sorterteBehandlinger.map((behandling, i) => {
                const erValgtBehandling = behandling.referanse === valgtBehandling?.referanse;
                const opplysningerFlettetInnIDenneBehandlingen =
                  erYtelsesbehandling(behandling) &&
                  sorterteBehandlinger.some((annenBehandling, j) => {
                    if (i < j) {
                      return false;
                    }
                    if (!erYtelsesbehandling(annenBehandling)) {
                      return false;
                    }
                    if (!behandling.vedtatt && annenBehandling.vedtatt) {
                      return true;
                    }
                    if (behandling.vedtatt && annenBehandling.vedtatt) {
                      return annenBehandling.vedtatt < behandling.vedtatt;
                    }
                    return false;
                  });

                return (
                  <BehandlingTableRow
                    key={behandling.referanse}
                    behandling={behandling}
                    oppdaterValgtBehandling={oppdaterValgtBehandling}
                    erValgtBehandling={erValgtBehandling}
                    opplysningerFlettetInnIDenneBehandlingen={opplysningerFlettetInnIDenneBehandlingen}
                  />
                );
              })}
            </Table.Body>
          </Table>
        </Box>
      )}

      {valgtBehandling && <BehandlingVisningPanel valgtBehandling={valgtBehandling} />}
    </Box>
  );
};

const erYtelsesbehandling = (behandling: BehandlingDriftsinfo) =>
  behandling.type === 'ae0034' || behandling.type === 'ae0028';
