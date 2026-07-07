import { useEffect, useState } from 'react';
import { Alert, Box, Heading, Loader, Table, Tag } from '@navikt/ds-react';
import { hentBrevbestillingerForBehandling, hentBrevbestillingerForSak } from 'lib/clientApi';
import { BrevbestillingDriftsinfoDto } from 'lib/types/brev';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';

const statusVariant = (status: string | null): 'success' | 'warning' | 'error' | 'neutral' => {
  switch (status) {
    case 'FERDIGSTILT':
    case 'FERDIG':
      return 'success';
    case 'AVBRUTT':
      return 'error';
    case 'UNDER_ARBEID':
      return 'warning';
    default:
      return 'neutral';
  }
};

export const BrevBestillinger = ({ saksnummer, behandlingRef }: { saksnummer?: string; behandlingRef?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bestillinger, setBestillinger] = useState<BrevbestillingDriftsinfoDto[]>([]);
  const [error, setError] = useState<string>();

  const handleResponse = (response: Promise<Response>) => {
    response
      .then(async (res) => {
        if (res.ok) return await res.json();
        else throw Error(await res.text());
      })
      .then((result: BrevbestillingDriftsinfoDto[]) => setBestillinger(result))
      .catch((err) => setError(`Noe gikk galt: ${err}`))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!saksnummer && !behandlingRef) throw Error('Saksnummer eller behandlingref må finnes');

    if (saksnummer) handleResponse(hentBrevbestillingerForSak(saksnummer));
    else if (behandlingRef) handleResponse(hentBrevbestillingerForBehandling(behandlingRef));
  }, [saksnummer, behandlingRef]);

  if (isLoading) return <Loader />;

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
        Bestilte brev ({bestillinger.length})
      </Heading>

      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}

      {bestillinger.length === 0 && !error && <Alert variant="info">Ingen brevbestillinger funnet.</Alert>}

      <BrevBestillingTabell bestillinger={bestillinger} />
    </Box>
  );
};

const BrevBestillingTabell = ({ bestillinger }: { bestillinger: BrevbestillingDriftsinfoDto[] }) => (
  <>
    {bestillinger.length > 0 && (
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Brevtype</Table.HeaderCell>
            <Table.HeaderCell>Behandlingreferanse</Table.HeaderCell>
            <Table.HeaderCell>Språk</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Prosesseringsstatus</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Oppdatert</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bestillinger.map((brev) => (
            <Table.Row key={brev.id}>
              <Table.DataCell>{brev.brevtype}</Table.DataCell>
              <Table.DataCell>{brev.behandlingReferanse}</Table.DataCell>
              <Table.DataCell>{brev.språk}</Table.DataCell>
              <Table.DataCell>
                {brev.status && (
                  <Tag variant={statusVariant(brev.status)} size="small">
                    {brev.status}
                  </Tag>
                )}
              </Table.DataCell>
              <Table.DataCell>
                {brev.prosesseringStatus && (
                  <Tag variant={statusVariant(brev.prosesseringStatus)} size="small">
                    {brev.prosesseringStatus}
                  </Tag>
                )}
              </Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(brev.opprettet)}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(brev.oppdatert)}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )}
  </>
);
