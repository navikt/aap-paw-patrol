'use client';

import { Alert, BodyShort, Box, Button, CopyButton, Detail, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import React, { useEffect, useState } from 'react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { rekjørJobb } from 'lib/clientApi';
import { format } from 'date-fns';
import { LinkIcon } from '@navikt/aksel-icons';
import { AvbrytJobbDialog } from 'components/drift/feilendejobber/AvbrytJobbDialog';
import { Kommentarfelt } from 'components/drift/feilendejobber/Kommentarfelt';
import { AnsvarligUtvikler } from 'components/drift/feilendejobber/AnsvarligUtvikler';

export const FeilendeJobbPanel = ({
  jobb,
  appNavn,
  innloggetNavIdent,
}: {
  jobb: JobbInfo;
  appNavn: AppNavn;
  innloggetNavIdent: string;
}) => {
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
        <HStack gap="space-16" justify="space-between" align="start">
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

          <div>
            {result ? (
              <Alert variant={result.success ? 'success' : 'error'} size="small">
                {result.message}
              </Alert>
            ) : (
              <HStack gap="space-8">
                <Button size="small" loading={isLoading} onClick={() => onRekjørJobbClick(jobb.id)}>
                  Rekjør
                </Button>
                <AvbrytJobbDialog appNavn={appNavn} jobbId={jobb.id} setResult={setResult} />
              </HStack>
            )}
          </div>
        </HStack>

        <HStack gap="space-24" wrap={false}>
          <div>
            <Detail>Type</Detail>
            <BodyShort size="small">{jobb.type}</BodyShort>
          </div>
          <div>
            <Detail>Forsøk</Detail>
            <BodyShort size="small">{jobb.antallFeilendeForsøk}</BodyShort>
          </div>
          <div>
            <Detail>Opprettet</Detail>
            <BodyShort size="small">
              {jobb.opprettetTidspunkt ? format(jobb.opprettetTidspunkt, 'dd.MM.yyyy HH:mm') : '—'}
            </BodyShort>
          </div>
          {[...objectToMap(jobb.metadata)].map(([key, value]) => (
            <div key={key}>
              <Detail>{key}</Detail>
              <CopyButton size="xsmall" copyText={value} text={value} activeText={`Kopierte ${key}`} />
            </div>
          ))}
        </HStack>

        <AnsvarligUtvikler
          jobbId={jobb.id}
          appNavn={appNavn}
          innloggetNavIdent={innloggetNavIdent}
          initiellAnsvarlig={jobb.tilleggsinfo?.ansvarlig ?? null}
        />

        <Box
          background="warning-soft"
          borderColor="warning-subtle"
          borderRadius="12"
          borderWidth="1"
          padding="space-16"
        >
          <HStack gap="space-8" align="center" marginBlock="space-0 space-8">
            <Label size="small">Feilmelding</Label>
            {jobb.feilmelding && <CopyButton copyText={jobb.feilmelding} text="Kopier" size="xsmall" />}
          </HStack>
          <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', maxHeight: '20rem', overflow: 'auto', margin: 0 }}>
            {jobb.feilmelding ?? '—'}
          </pre>
        </Box>

        <Kommentarfelt jobbId={jobb.id} appNavn={appNavn} kommentarer={jobb.tilleggsinfo?.kommentarer ?? []} />
      </VStack>
    </Box>
  );
};
