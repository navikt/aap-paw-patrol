'use client';

import { useState } from 'react';
import {
  BodyShort,
  Button,
  FileObject,
  FileUpload,
  Heading,
  InfoCard,
  List,
  TextField,
  VStack,
} from '@navikt/ds-react';
import { ettersendForPerson } from 'lib/clientApi';
import { UploadIcon } from '@navikt/aksel-icons';
import { fileToBase64 } from 'lib/utils/file.ts';

export const EttersendDokument = () => {
  const [ident, setIdent] = useState('');
  const [eksternReferanseId, setEksternReferanseId] = useState('');
  const [file, setFile] = useState<FileObject>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    setIsLoading(true);
    setMessage('');

    if (!ident) {
      setMessage('Ident til bruker må angis');
      setIsLoading(false);
      return;
    }
    if (!file) {
      setMessage('Ingen fil lastet opp');
      setIsLoading(false);
      return;
    }

    try {
      const pdfBase64 = await fileToBase64(file.file);
      if(pdfBase64){
        const response = await ettersendForPerson({
          ident,
          eksternReferanseId: eksternReferanseId || null,
          pdfBase64,
          filNavn: file.file.name,
        });
        if (response.ok) {
          setMessage('ok 👍');
        } else {
          setMessage(await response.text());
        }
      } else {
        setMessage('Noe gikk galt med base64-enkoding av pdfen')
      }
    } catch (err) {
      console.log(err);
      setMessage('Noe gikk galt');
    }
    setIsLoading(false);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      {<Heading size="medium">Ettersend dokument på vegne av bruker</Heading>}

      <InfoCard data-color="info">
        <InfoCard.Header>
          <InfoCard.Title>Ettersend dokument</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <BodyShort spacing>
            Denne funksjonaliteten benyttes for å sende inn en pdf-fil på vegne av bruker. Den havner i postmottak på
            samme måte som når bruker selv ettersender filer.
          </BodyShort>
          <strong>Apper som oppdateres:</strong>
          <List>
            <List.Item>postmottak</List.Item>
          </List>
        </InfoCard.Content>
      </InfoCard>

      <TextField label="Brukers fnr" value={ident} onChange={(e) => setIdent(e.target.value)} />
      <TextField
        label="Innsendingsid(valgfritt)"
        value={eksternReferanseId}
        onChange={(e) => setEksternReferanseId(e.target.value)}
      />
      <FileUpload.Trigger
        accept=".pdf"
        maxSizeInBytes={1_000_000}
        onSelect={(_, { accepted }) => {
          const acceptedFile = accepted.at(0);
          setFile(acceptedFile ? { file: acceptedFile, error: false } : undefined);
        }}
        multiple={false}
      >
        <Button variant="secondary" icon={<UploadIcon aria-hidden />}>
          Velg fil
        </Button>
      </FileUpload.Trigger>
      {file && (
        <FileUpload.Item
          key={file.file.name}
          file={file.file}
          button={{
            action: 'delete',
            onClick: () => setFile(undefined),
          }}
        />
      )}

      <Button onClick={onClick} loading={isLoading}>
        Journalfør dokument
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};
