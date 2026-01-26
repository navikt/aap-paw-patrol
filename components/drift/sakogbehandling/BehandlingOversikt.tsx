'use client';
import { useEffect, useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Heading,
  HGrid,
  HStack,
  Label,
  Loader,
  Tabs,
  Tag,
  TextField,
  VStack,
} from '@navikt/ds-react';
import { BehandlingInfo } from 'components/drift/settaktivtsteg/BehandlingInfo';
import * as uuid from 'uuid';
import { SettAktivtStegV2 } from 'components/drift/sakogbehandling/SettAktivtStegV2';
import { hentBehandlingDriftsinfo } from 'lib/clientApi';
import { BehandlingDriftsinfoDTO } from 'lib/types/avklaringsbehov';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';

function formaterStatus(status: string) {
  switch (status) {
    case 'ae0028':
      return 'Revurdering';
    case 'ae0034':
      return 'Førstegangsbehandling';
    default:
      return status;
  }
}

export const BehandlingOversikt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [behandlingsreferanse, setBehandlingsreferanse] = useState<string>(searchParams.get('ref') || '');
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [behandling, setBehandling] = useState<BehandlingDriftsinfoDTO>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (behandlingsreferanse && uuid.validate(behandlingsreferanse)) {
        setError(undefined);
        await router.replace(`?ref=${behandlingsreferanse}`);
        await hentBehandling();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [behandlingsreferanse]);

  const hentBehandling = async () => {
    setBehandling(undefined);
    setError(undefined);
    setIsLoading(true);

    try {
      await hentBehandlingDriftsinfo(behandlingsreferanse).then(async (res) => {
        if (res.ok) setBehandling(await res.json());
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Box
        background="neutral-soft"
        padding="space-16"
        marginBlock="space-32"
        borderRadius="16"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <VStack gap="space-16">
          <Heading size="medium">Hent behandling</Heading>
          <TextField
            label="Behandlingsreferanse (UUID)"
            value={behandlingsreferanse}
            onChange={(e) => setBehandlingsreferanse(e.target.value)}
            htmlSize={40}
            error={behandlingsreferanse && !uuid.validate(behandlingsreferanse) ? 'Må være en gyldig UUID' : undefined}
          />
          {error && (
            <Alert variant="warning" size="small">
              {error}
            </Alert>
          )}
          {!isLoading && behandling && (
            <Box background="default" padding="space-16" marginBlock="space-32" borderRadius="16">
              <HStack gap="space-32">
                <div>
                  <Label>Type</Label>
                  <BodyShort>{formaterStatus(behandling.behandling.type)}</BodyShort>
                </div>
                <div>
                  <Label>Status</Label>
                  <BodyShort>
                    <Tag variant="info" size="small">
                      {behandling.behandling.status}
                    </Tag>
                  </BodyShort>
                </div>
                <div>
                  <Label>Årsak til opprettelse</Label>
                  <BodyShort>{behandling.behandling.årsakTilOpprettelse}</BodyShort>
                </div>
                <div>
                  <Label>Opprettet</Label>
                  <BodyShort>{formaterDatoMedTidspunktSekunderForFrontend(behandling.behandling.opprettet)}</BodyShort>
                </div>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
      {isLoading && <Loader />}
      {!isLoading && !!behandling && (
        <HGrid columns="4fr 2fr" gap="space-16" maxWidth={'1680px'} marginInline={'auto'} marginBlock="space-0">
          <Box padding="space-16" borderRadius="16">
            {!!behandlingsreferanse && <BehandlingInfo behandling={behandling} />}
          </Box>

          <Box
            background="neutral-soft"
            padding="space-16"
            borderRadius="16"
            borderColor="neutral-subtle"
            borderWidth="1"
          >
            <Tabs defaultValue="SETT_AKTIVT_STEG">
              <Tabs.List>
                <Tabs.Tab value="SETT_AKTIVT_STEG" label="Sett aktivt steg" />
              </Tabs.List>

              <Tabs.Panel value="SETT_AKTIVT_STEG">
                <SettAktivtStegV2 behandlingsreferanse={behandlingsreferanse} refresh={hentBehandling} />
              </Tabs.Panel>
            </Tabs>
          </Box>
        </HGrid>
      )}
    </>
  );
};
