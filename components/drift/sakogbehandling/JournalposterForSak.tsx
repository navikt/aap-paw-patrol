import { useEffect, useState } from 'react';
import { Alert, BodyShort, Box, Heading, HStack, InfoCard, Link, Loader, Table } from '@navikt/ds-react';
import NextLink from 'next/link';
import { FetchJsonBody, hentJournalposterForSak } from 'lib/clientApi';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { InformationSquareIcon } from '@navikt/aksel-icons';

type SakJournalposterDto = FetchJsonBody<ReturnType<typeof hentJournalposterForSak>>;

export const JournalposterForSak = ({ saksnummer }: { saksnummer: string }) => {
  const [data, setData] = useState<SakJournalposterDto>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let aktiv = true;

    const hentJournalposter = async () => {
      try {
        const response = await hentJournalposterForSak(saksnummer);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const result = await response.json();
        if (aktiv) setData(result);
      } catch (err) {
        if (aktiv) {
          console.error(err);
          setError('Kunne ikke hente journalposter. Last siden på nytt for å prøve igjen.');
        }
      }
    };

    hentJournalposter();
    return () => {
      aktiv = false;
    };
  }, [saksnummer]);

  return (
    <Box
      background="neutral-soft"
      padding="space-16"
      margin="space-16"
      borderRadius="16"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <Heading size="medium" level="2" textColor="subtle" spacing>
        Journalposter tilknyttet sak{data ? ` (${data.journalposter.length})` : ''}
      </Heading>
      <InfoCard data-color="neutral" size="small">
        <InfoCard.Message icon={<InformationSquareIcon />}>
          Viser kun journalposter som har blitt behandlet i Postmottak og knyttet til denne saken. Bruk Gosys for å se
          alle journalposter på brukeren.
        </InfoCard.Message>
      </InfoCard>

      {error ? (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      ) : !data ? (
        <HStack gap="space-8" align="center" role="status">
          <Loader title="Henter journalposter" aria-hidden />
          <BodyShort>Henter journalposter...</BodyShort>
        </HStack>
      ) : data.journalposter.length === 0 ? (
        <BodyShort>Ingen journalposter knyttet til saken.</BodyShort>
      ) : (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Journalpost-ID</Table.HeaderCell>
              <Table.HeaderCell scope="col">Journalstatus</Table.HeaderCell>
              <Table.HeaderCell scope="col">Kanal</Table.HeaderCell>
              <Table.HeaderCell scope="col">Mottatt dato</Table.HeaderCell>
              <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.journalposter.map(({ journalpostId, journalstatus, kanal, mottattDato, tema }) => (
              <Table.Row key={journalpostId}>
                <Table.DataCell>
                  <Link as={NextLink} href={`/drift/postmottak/${journalpostId}`}>
                    {journalpostId}
                  </Link>
                </Table.DataCell>
                <Table.DataCell>{journalstatus ?? '-'}</Table.DataCell>
                <Table.DataCell>{kanal ?? '-'}</Table.DataCell>
                <Table.DataCell>{mottattDato ? formaterDatoForFrontend(mottattDato) : '-'}</Table.DataCell>
                <Table.DataCell>{tema ?? '-'}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Box>
  );
};
