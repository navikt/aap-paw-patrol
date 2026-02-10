import { useEffect, useState } from 'react';
import { hentOppgaver } from 'lib/clientApi';
import { BodyShort, Box, HStack, Label, Loader, Table, Tag } from '@navikt/ds-react';
import { OppgaveDriftsinfoDTO, OppgaveStatus } from 'lib/types/oppgave';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';

export const Oppgaver = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [oppgaver, setOppgaver] = useState<OppgaveDriftsinfoDTO[]>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (behandlingsreferanse) {
        await hentOppgaver(behandlingsreferanse)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((oppgaver: OppgaveDriftsinfoDTO[]) => setOppgaver(oppgaver))
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
        <Loader />
        <span>Henter oppgaver for behandling ...</span>
      </HStack>
    );
  } else if (!isLoading && !oppgaver?.length) {
    return (
      <Box paddingBlock="space-32" paddingInline="space-16">
        <BodyShort>Ingen oppgaver</BodyShort>
      </Box>
    );
  }

  return (
    <Box paddingBlock="space-32" paddingInline="space-16">
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>OppgaveID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Avklaringsbehov</Table.HeaderCell>
            <Table.HeaderCell>Enhet</Table.HeaderCell>
            <Table.HeaderCell>Reservert av</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Endret</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver?.map((oppg) => (
            <Table.ExpandableRow
              key={oppg.oppgaveId}
              content={
                <Box background="default" padding="space-16">
                  <HStack gap="space-16">
                    <div>
                      <Label>Veileder arbeid</Label>
                      <BodyShort>{oppg.veilederArbeid}</BodyShort>
                    </div>
                    <div>
                      <Label>Veileder sykdom</Label>
                      <BodyShort>{oppg.veilederSykdom}</BodyShort>
                    </div>
                    <div>
                      <Label>Oppfølgingsenhet</Label>
                      <BodyShort>{oppg.oppfølgingsenhet}</BodyShort>
                    </div>
                  </HStack>
                </Box>
              }
            >
              <Table.DataCell>{oppg.oppgaveId}</Table.DataCell>
              <Table.DataCell>{tag(oppg.status)}</Table.DataCell>
              <Table.DataCell>{mapBehovskodeTilBehovstype(oppg.avklaringsbehovKode)}</Table.DataCell>
              <Table.DataCell>{oppg.enhet}</Table.DataCell>
              <Table.DataCell>{oppg.reservertAv ?? '-'}</Table.DataCell>
              <Table.DataCell style={{ whiteSpace: 'nowrap' }}>
                {formaterDatoMedTidspunktSekunderForFrontend(oppg.opprettetTidspunkt)}
              </Table.DataCell>
              <Table.DataCell>
                {oppg.endretTidspunkt ? formaterDatoMedTidspunktSekunderForFrontend(oppg.endretTidspunkt) : '-'}
              </Table.DataCell>
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

const tag = (status: OppgaveStatus) => {
  switch (status) {
    case OppgaveStatus.AVSLUTTET:
      return (
        <Tag size="small" variant="warning">
          {capitalize(status)}
        </Tag>
      );
    default:
      return (
        <Tag size="small" variant="neutral">
          {capitalize(status)}
        </Tag>
      );
  }
};
