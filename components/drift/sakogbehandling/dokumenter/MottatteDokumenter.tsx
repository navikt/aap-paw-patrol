import { useEffect, useState } from 'react';
import { hentMottatteDokumenter } from 'lib/clientApi';
import { MottattDokumentDriftsinfoDTO } from 'lib/types/dokumenter';
import { Alert, BodyShort, Box, Heading, HelpText, HStack, Loader, Table } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';
import Link from 'next/link';

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

      <BodyShort textColor="subtle" spacing>
        Kan være både dokumenter og generelle hendelser på saken. Eksempelvis dokument behandlet i postmottak (vil kun
        vises her når det er ferdig behandlet), manuelt opprettet revurdering, m.m.
      </BodyShort>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">ID</Table.HeaderCell>
            <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kanal</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <HStack gap="space-8">
                <span>Mottatt tidspunkt</span>
                <HelpText>
                  Må ikke forveksles med journalpost mottattDato. Denne kan være manuelt satt dato fra
                  digitaliseringsflyten i Postmottak, eller journalposten sin mottattTid/mottattDato. Hvis revurdering
                  er det tidspunktet revurderingen ble opprettet.
                </HelpText>
              </HStack>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dokumenter.map((dokument) => (
            <Table.Row key={crypto.randomUUID()}>
              <Table.DataCell>
                {dokument.referanse.type === 'JOURNALPOST' ? (
                  <Link href={`/drift/postmottak/${dokument.referanse.verdi}`}>{dokument.referanse.verdi}</Link>
                ) : (
                  dokument.referanse.verdi
                )}
              </Table.DataCell>
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
