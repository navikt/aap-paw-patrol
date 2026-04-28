import { useEffect, useState } from 'react';
import { hentDialogmeldinger } from 'lib/clientApi';
import { DialogmeldingDriftinfoDTO } from 'lib/types/dokumenter';
import { Alert, Box, Heading, Loader, Table } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

export const Dialogmeldinger = ({ saksnummer }: { saksnummer: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogmeldinger, setDialogmeldinger] = useState<DialogmeldingDriftinfoDTO[]>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (saksnummer) {
        await hentDialogmeldinger(saksnummer)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((data: DialogmeldingDriftinfoDTO[]) => {
            setDialogmeldinger(data);
          })
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [saksnummer]);

  if (isLoading) {
    return <Loader />;
  } else if (!dialogmeldinger?.length) {
    return <Alert variant="info">Ingen dialogmeldinger funnet</Alert>;
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
        Dialogmeldinger ({dialogmeldinger.length})
      </Heading>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">UUID</Table.HeaderCell>
            <Table.HeaderCell scope="col">Bestiller</Table.HeaderCell>
            <Table.HeaderCell scope="col">Behandler HPR</Table.HeaderCell>
            <Table.HeaderCell scope="col">Dokumentasjonstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Flytstatus</Table.HeaderCell>
            <Table.HeaderCell scope="col">Statustekst</Table.HeaderCell>
            <Table.HeaderCell scope="col">Journalpost ID</Table.HeaderCell>
            <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dialogmeldinger.map((melding) => (
            <Table.Row key={melding.dialogmeldingUuid}>
              <Table.DataCell>{melding.dialogmeldingUuid}</Table.DataCell>
              <Table.DataCell>{melding.bestillerNavIdent}</Table.DataCell>
              <Table.DataCell>{melding.behandlerHprNr}</Table.DataCell>
              <Table.DataCell>{melding.dokumentasjonType}</Table.DataCell>
              <Table.DataCell>{melding.status ?? '-'}</Table.DataCell>
              <Table.DataCell>{melding.flytStatus ?? '-'}</Table.DataCell>
              <Table.DataCell>{melding.statusTekst ?? '-'}</Table.DataCell>
              <Table.DataCell>{melding.journalpostId ?? '-'}</Table.DataCell>
              <Table.DataCell>
                {formaterDatoMedTidspunktSekunderForFrontend(melding.opprettet.toString())}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
