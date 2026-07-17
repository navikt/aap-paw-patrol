import { Alert, BodyShort, Button, Detail, HStack, Tag } from '@navikt/ds-react';
import React, { useState } from 'react';
import { AppNavn } from 'lib/services/driftService';
import { settAnsvarlig } from 'lib/clientApi';
import { PersonGroupIcon, XMarkIcon } from '@navikt/aksel-icons';

export const AnsvarligUtvikler = ({
  jobbId,
  appNavn,
  innloggetNavIdent,
  initiellAnsvarlig,
}: {
  jobbId: number;
  appNavn: AppNavn;
  innloggetNavIdent: string;
  initiellAnsvarlig: string | null;
}) => {
  const [ansvarlig, setAnsvarlig] = useState(initiellAnsvarlig);
  const [ansvarligLoading, setAnsvarligLoading] = useState(false);
  const [ansvarligResult, setAnsvarligResult] = useState<{ success: boolean; message: string }>();

  async function onSettAnsvarligClick(id: number, verdi: string) {
    setAnsvarligResult(undefined);
    setAnsvarligLoading(true);
    await settAnsvarlig(appNavn, id, verdi)
      .then(async (res) => {
        if (res.ok) {
          setAnsvarlig(verdi || null);
          setAnsvarligResult({ success: true, message: verdi ? `Tildelt ${verdi}` : 'Ansvarlig fjernet' });
        } else {
          setAnsvarligResult({ success: false, message: await res.text() });
        }
      })
      .catch((err) => setAnsvarligResult({ success: false, message: err.message || 'Noe gikk galt' }))
      .finally(() => setAnsvarligLoading(false));
  }

  return (
    <div>
      <Detail spacing>Ansvarlig</Detail>
      <HStack gap="space-8" align="center">
        {ansvarlig ? (
          <Tag variant="info" size="small" icon={<PersonGroupIcon aria-hidden />}>
            {ansvarlig}
          </Tag>
        ) : (
          <BodyShort size="small" style={{ color: 'var(--a-text-subtle)', fontStyle: 'italic' }}>
            Ikke tildelt
          </BodyShort>
        )}

        {ansvarlig !== innloggetNavIdent ? (
          <Button
            size="xsmall"
            variant="secondary"
            loading={ansvarligLoading}
            onClick={() => onSettAnsvarligClick(jobbId, innloggetNavIdent)}
          >
            Tildel meg
          </Button>
        ) : (
          <Button
            size="xsmall"
            variant="tertiary-neutral"
            icon={<XMarkIcon aria-hidden />}
            loading={ansvarligLoading}
            onClick={() => onSettAnsvarligClick(jobbId, '')}
          >
            Fjern
          </Button>
        )}

        {ansvarligResult && (
          <Alert variant={ansvarligResult.success ? 'success' : 'error'} size="small" inline>
            {ansvarligResult.message}
          </Alert>
        )}
      </HStack>
    </div>
  );
};
