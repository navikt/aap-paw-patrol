import { Alert, Button, Checkbox, Heading, InlineMessage, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { prosesserBehandling } from 'lib/clientApi';
import { BehandlingDriftsinfo, BehandlingStatus } from 'lib/types/avklaringsbehov';

export const ProsesserBehandling = ({ behandling }: { behandling: BehandlingDriftsinfo }) => {
  const behandlingsreferanse = behandling.referanse;

  const [skalForberede, setSkalForberede] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onClick = async () => {
    setMessage(undefined);
    setError(undefined);

    if (!behandlingsreferanse) {
      setError('Fant ikke behandlingsreferanse');
      return;
    }

    setIsLoading(true);

    try {
      await prosesserBehandling(behandlingsreferanse, skalForberede).then(async (res) => {
        if (res.ok) setMessage('ok 👍');
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  if ([BehandlingStatus.AVSLUTTET].includes(behandling.status)) {
    return null;
  }

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Prosesser behandling</Heading>
      <Checkbox size="small" checked={skalForberede} onChange={(e) => setSkalForberede(e.target.checked)}>
        Forbered behandling{' '}
      </Checkbox>

      {skalForberede && (
        <InlineMessage status="info">
          Har ansvar for å sette behandlingen i en oppdatert tilstand i form av å innhente opplysninger for stegene
          man allerede har prosessert og vurdere om man er nødt til å behandle steget på nytt hvis det er oppdaterte
          opplysninger.
        </InlineMessage>
      )}

      <Button style={{ width: 'fit-content' }} onClick={onClick} loading={isLoading}>
        Prosesser behandling
      </Button>

      {message && (
        <VStack gap="space-8">
          <Alert variant="info">{message} - Last siden på nytt for å se endringen</Alert>
        </VStack>
      )}
      {error && <Alert variant="error">{error}</Alert>}
      {skalForberede && behandling.status === 'IVERKSETTES' && (
        <Alert size="small" variant="warning">
          Vær forsiktig med å forberede behandlinger som iverksettes.
        </Alert>
      )}
    </VStack>
  );
};
