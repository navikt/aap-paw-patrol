import { useEffect, useState } from 'react';
import { hentMottatteDokumenter } from 'lib/clientApi';
import { MottattDokumentDriftsinfoDTO } from 'lib/types/dokumenter';
import { Alert, Box, Heading, Loader, Table } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

export const MottatteDokumenter = ({ saksnummer }: { saksnummer: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dokumenter, setDokumenter] = useState<MottattDokumentDriftsinfoDTO[]>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (saksnummer) {
        await hentMottatteDokumenter(saksnummer)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((dokumenter: MottattDokumentDriftsinfoDTO[]) => {
            setDokumenter(dokumenter);
          })
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [saksnummer]);

  if (isLoading) {
    return <Loader />;
  } else if (!dokumenter?.length) {
    return <Alert variant="info">Ingen dokumenter funnet</Alert>;
  }

  return (
    <Box
      background="neutral-soft"
      padding="space-16"
      margin="space-16"
      borderRadius="16"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <Heading size="medium" textColor="subtle" spacing>
        Mottatte dokumenter ({dokumenter.length})
      </Heading>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kanal</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Mottatt tidspunkt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dokumenter.map((dokument) => (
            <Table.Row key={crypto.randomUUID()}>
              <Table.DataCell>{capitalize(dokument.referanse.type)}</Table.DataCell>
              <Table.DataCell>{capitalize(dokument.type)}</Table.DataCell>
              <Table.DataCell>{dokument.kanal}</Table.DataCell>
              <Table.DataCell>{dokument.status}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(dokument.mottattTidspunkt)}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
