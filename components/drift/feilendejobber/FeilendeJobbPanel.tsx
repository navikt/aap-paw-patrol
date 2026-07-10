'use client';

import { Alert, BodyShort, Box, Button, CopyButton, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import React, { useEffect, useState } from 'react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { rekjørJobb } from 'lib/clientApi';
import { format } from 'date-fns';
import { LinkIcon } from '@navikt/aksel-icons';
import { AvbrytJobbDialog } from 'components/drift/feilendejobber/AvbrytJobbDialog';

export const FeilendeJobbPanel = ({ jobb, appNavn }: { jobb: JobbInfo; appNavn: AppNavn }) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>();

  async function onRekjørJobbClick(id: number) {
    setResult(undefined);
    setIsLoading(true);
    await rekjørJobb(appNavn, id)
      .then(async (res) => setResult({ success: res.ok, message: await res.text() }))
      .catch((err) => setResult({ success: false, message: err.message || 'Noe gikk galt' }))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && window.location.hash === `#${jobb.id}`) {
      const el = document.getElementById(jobb.id.toString());
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [mounted, jobb.id]);

  return (
    <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="12" padding="space-16" id={jobb.id.toString()}>
      <VStack gap="space-16">
        <HStack gap="space-16" justify="space-between">
          <Heading size="medium">
            <HStack gap="space-8" align="center">
              <span>Jobb {jobb.id}</span>

              {mounted && (
                <CopyButton
                  icon={<LinkIcon aria-hidden />}
                  size="small"
                  text="Kopier lenke til jobb"
                  activeText="Lenken er kopiert"
                  copyText={`${window.location.origin}${window.location.pathname}#${jobb.id}`}
                />
              )}
            </HStack>
          </Heading>

          <VStack gap="space-16">
            {result ? (
              <Alert variant={result.success ? 'success' : 'error'} size="small">
                {result.message}
              </Alert>
            ) : (
              <HStack justify={'end'} gap="space-16">
                <Button size="small" loading={isLoading} onClick={() => onRekjørJobbClick(jobb.id)}>
                  Rekjør
                </Button>

                <AvbrytJobbDialog appNavn={appNavn} jobbId={jobb.id} setResult={setResult} />
              </HStack>
            )}
          </VStack>
        </HStack>

        <HStack gap="space-16" justify="space-between">
          <VStack gap="space-16">
            <HStack gap="space-32">
              <div>
                <Label size="small">Type</Label>
                <BodyShort size="small">{jobb.type}</BodyShort>
              </div>

              <div>
                <Label size="small">Forsøk</Label>
                <BodyShort size="small">{jobb.antallFeilendeForsøk}</BodyShort>
              </div>

              <div>
                <Label size="small">Opprettet tidspunkt</Label>
                <BodyShort size="small">
                  {jobb.opprettetTidspunkt ? format(jobb.opprettetTidspunkt, 'dd.MM.yyyy HH:mm:ss') : '-'}
                </BodyShort>
              </div>

              {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                return (
                  <div key={key}>
                    <Label size="small">{key}</Label>
                    <div>
                      <CopyButton size="xsmall" copyText={value} text={value} activeText={`Kopierte ${key}`} />
                    </div>
                  </div>
                );
              })}
            </HStack>
          </VStack>
        </HStack>

        <div>
          <Box
            background="warning-soft"
            borderColor="warning-subtle"
            borderRadius="12"
            borderWidth="1"
            padding="space-16"
          >
            <HStack gap="space-16">
              <Label>Feilmelding</Label>
              {jobb.feilmelding && <CopyButton copyText={jobb.feilmelding} text="Kopier feilmelding" size="xsmall" />}
            </HStack>

            <pre style={{ fontSize: 'small', whiteSpace: 'pre-wrap', maxHeight: '20rem', overflow: 'scroll' }}>
              {jobb.feilmelding}
            </pre>
          </Box>
        </div>
      </VStack>
    </Box>
  );
};
