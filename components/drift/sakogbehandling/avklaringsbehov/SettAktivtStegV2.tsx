import { Alert, Button, Heading, InlineMessage, Tag, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { muligeStegOptions } from 'components/drift/settaktivtsteg/SettAktivtSteg';
import { useState } from 'react';
import { kjørFraSteg } from 'lib/clientApi';
import { BehandlingDriftsinfo, BehandlingStatus } from 'lib/types/avklaringsbehov';
import { formaterBehandlingType } from 'lib/utils/formatting';

export const SettAktivtStegV2 = ({ behandling }: { behandling: BehandlingDriftsinfo }) => {
  const behandlingsreferanse = behandling.referanse;

  const [steg, setSteg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onClick = async () => {
    setMessage(undefined);
    setError(undefined);

    if (!behandlingsreferanse || !steg) {
      setError('Behandlingsreferanse og steg må fylles ut');
      return;
    }

    setIsLoading(true);
    console.log('kjør-fra-steg', { behandlingsreferanse, steg });

    try {
      await kjørFraSteg(behandlingsreferanse, steg).then(async (res) => {
        if (res.ok) setMessage('ok 👍');
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  if ([BehandlingStatus.IVERKSETTES, BehandlingStatus.AVSLUTTET].includes(behandling.status)) {
    return null;
  }

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Sett aktivt steg for behandling</Heading>

      <UNSAFE_Combobox
        label="Steg"
        options={muligeStegOptions(behandling.type)}
        multiple={false}
        onToggleSelected={(value) => setSteg(value)}
        shouldAutocomplete={false}
      />

      {steg && (
        <InlineMessage status="info">
          Du setter nå aktivt steg til{' '}
          <Tag size="small" variant="warning">
            {steg}
          </Tag>{' '}
          for <strong>{formaterBehandlingType(behandling.type)}</strong> med referanse:
          <br />
          <strong>{behandlingsreferanse}</strong>
        </InlineMessage>
      )}

      <Button onClick={onClick} loading={isLoading} disabled={!steg}>
        Sett aktivt steg
      </Button>

      {message && (
        <VStack gap="space-8">
          <Alert variant="info">{message} - Last siden på nytt for å se endringen</Alert>
        </VStack>
      )}
      {error && <Alert variant="error">{error}</Alert>}
      {steg === 'SØKNAD' && (
        <Alert size="small" variant="warning">
          Burde kun brukes hvis søknad er trukket!
        </Alert>
      )}
    </VStack>
  );
};
