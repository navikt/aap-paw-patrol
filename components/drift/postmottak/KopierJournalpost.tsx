'use client';

import { Alert, Button, HelpText, Label } from '@navikt/ds-react';
import { kopierJournalpost } from 'lib/clientApi';
import { useState } from 'react';

export const KopierJournalpost = ({ journalpostId }: { journalpostId: string }) => {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nyJournalpost, setNyJournalpost] = useState<string>();

  const onClickKopierJournalpost = async () => {
    setNyJournalpost(undefined);
    setError(undefined);
    setIsSubmitting(true);
    try {
      await kopierJournalpost(journalpostId.trim())
        .then(async (res) => {
          if (res.ok) {
            return await res.json();
          } else {
            throw Error(await res.text());
          }
        })
        .then((data: string) => {
          setNyJournalpost(data);
        })
        .catch((err) => {
          console.log(err);
          setError(`Noe gikk galt: ${err}`);
        });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div>
        <Label size="small">Kopier journalpost</Label>{' '}
        <HelpText title="Om kopier">
          Kopiering av journalposter kan brukes dersom den er journalført på trukket sak og må journalføres på nytt for
          å opprette noe på en ny sak.
        </HelpText>
      </div>
      <Button onClick={onClickKopierJournalpost} loading={isSubmitting} disabled={nyJournalpost !== undefined}>
        Kopier journalpost
      </Button>
      {nyJournalpost && <Alert variant="info">Har opprettet ny journalpost - ny id er {nyJournalpost}</Alert>}
      {error && (
        <Alert variant="error" size="small">
          {error}
        </Alert>
      )}
    </div>
  );
};
