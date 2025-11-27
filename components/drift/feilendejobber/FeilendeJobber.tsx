'use client';

import React, { useState } from 'react';
import { Alert, BodyShort, Box, Button, CopyButton, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { avbrytKjørendeJobb, rekjørJobb } from 'lib/clientApi';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import { AppNavn, JobbInfo } from 'lib/services/driftService';

interface Props {
  appNavn: AppNavn;
  jobber: JobbInfo[];
}

export const FeilendeJobber = ({ jobber, appNavn }: Props) => {
  const [isLoadingRekjørJobb, setIsLoadingRekjørJobb] = useState<boolean>(false);
  const [isLoadingAvbrytJobb, setIsLoadingAvbrytJobb] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const harFeilendeJobber = jobber.length > 0;

  async function onRekjørJobbClick(id: number) {
    setIsLoadingRekjørJobb(true);
    try {
      const rekjørRes = await rekjørJobb(appNavn, id);
      if (rekjørRes.ok) {
        const message = await rekjørRes.text();
        setMessage(message);
      } else {
        const message = await rekjørRes.text();
        setMessage(message);
      }
    } catch (err) {
      console.log('err', err);
      setMessage('Noe gikk galt');
      setIsLoadingRekjørJobb(false);
    }
    setIsLoadingRekjørJobb(false);
  }

  async function onAvbrytJobbClick(id: number) {
    setIsLoadingAvbrytJobb(true);
    try {
      const res = await avbrytKjørendeJobb(appNavn, id);
      if (res.ok) {
        const message = await res.text();
        setMessage(message);
      } else {
        const message = await res.text();
        setMessage(message);
      }
    } catch (err) {
      console.log('err', err);
      setMessage('Noe gikk galt');
      setIsLoadingAvbrytJobb(false);
    }
    setIsLoadingAvbrytJobb(false);
  }

  return (
    <VStack gap="4" marginBlock="8">
      <Heading size={'small'} level={'3'}>
        Feilende jobber
      </Heading>

      {harFeilendeJobber ? (
        <Alert variant={'error'}>Det finnes {jobber.length} feilede jobb(er)</Alert>
      ) : (
        <Alert variant={'success'}>Det finnes ingen feilende jobber</Alert>
      )}

      {harFeilendeJobber && (
        <VStack gap="4">
          {jobber.map((jobb, index) => (
            <Box key={index} borderWidth="1" borderColor="border-divider" borderRadius="large" padding="4">
              <VStack gap="4">
                <HStack gap="4" justify="space-between">
                  <HStack gap="8">
                    <VStack gap="4">
                      <div>
                        <Label>Type</Label>
                        <BodyShort>{jobb.type}</BodyShort>
                      </div>
                      <div>
                        <Label>Antall feilende forsøk</Label>
                        <BodyShort>{jobb.antallFeilendeForsøk}</BodyShort>
                      </div>
                    </VStack>

                    <VStack gap="4">
                      <div>
                        <Label>Status</Label>
                        <BodyShort>{jobb.status}</BodyShort>
                      </div>

                      <div>
                        <Label>ID</Label>
                        <BodyShort>{jobb.id}</BodyShort>
                      </div>
                    </VStack>

                    {jobb.opprettetTidspunkt && (
                      <div>
                        <Label>Opprettet tidspunkt</Label>
                        <BodyShort>{jobb.opprettetTidspunkt}</BodyShort>
                      </div>
                    )}
                  </HStack>

                  <div>
                    <HStack justify={'end'} gap={'4'}>
                      <Button loading={isLoadingRekjørJobb} onClick={() => onRekjørJobbClick(jobb.id)}>
                        Rekjør
                      </Button>
                      <Button loading={isLoadingAvbrytJobb} onClick={() => onAvbrytJobbClick(jobb.id)}>
                        Avbryt
                      </Button>
                    </HStack>
                    {message && <BodyShort>{message}</BodyShort>}
                  </div>
                </HStack>

                <div>

                  <Box
                    background="surface-warning-subtle"
                    borderColor="border-warning"
                    borderRadius="large"
                    borderWidth="1"
                    padding="4"
                  >
                    <HStack gap="4">
                      <Label>Feilmelding</Label>
                      {jobb.feilmelding && (
                        <CopyButton copyText={jobb.feilmelding} text="Kopier feilmelding" size="xsmall" />
                      )}
                    </HStack>

                    <pre style={{ fontSize: 'small', whiteSpace: 'pre-wrap', maxHeight: '20rem', overflow: 'scroll' }}>
                      {jobb.feilmelding}
                    </pre>
                  </Box>
                </div>

                {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                  return (
                    <div key={key}>
                      <Label>{key}</Label>
                      <BodyShort>{value}</BodyShort>
                    </div>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
