import { useEffect, useState } from 'react';
import { hentOppgaver } from 'lib/clientApi';
import { BodyShort, Box, HStack, Loader, Table, Tag } from '@navikt/ds-react';
import { OppgaveDriftsinfoDTO, OppgaveStatus } from 'lib/types/oppgave';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

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
            <Table.HeaderCell>OppgaveID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Enhet</Table.HeaderCell>
            <Table.HeaderCell>Oppfølgingsenhet</Table.HeaderCell>
            <Table.HeaderCell>Reservert av</Table.HeaderCell>
            <Table.HeaderCell>Veileder arbeid</Table.HeaderCell>
            <Table.HeaderCell>Veileder sykdom</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Endret</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver?.map((oppg) => (
            <Table.Row key={oppg.oppgaveId}>
              <Table.DataCell>{oppg.oppgaveId}</Table.DataCell>
              <Table.DataCell>{tag(oppg.status)}</Table.DataCell>
              <Table.DataCell>{oppg.enhet}</Table.DataCell>
              <Table.DataCell>{oppg.oppfølgingsenhet}</Table.DataCell>
              <Table.DataCell>{oppg.reservertAv}</Table.DataCell>
              <Table.DataCell>{oppg.veilederArbeid}</Table.DataCell>
              <Table.DataCell>{oppg.veilederSykdom}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(oppg.opprettetTidspunkt)}</Table.DataCell>
              <Table.DataCell>
                {oppg.endretTidspunkt ? formaterDatoMedTidspunktSekunderForFrontend(oppg.endretTidspunkt) : '-'}
              </Table.DataCell>
            </Table.Row>
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
