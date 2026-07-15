import { useEffect, useState } from 'react';
import { hentMeldekortDriftsinfo } from 'lib/clientApi';
import { MeldekortDriftsinfoDto } from 'lib/types/meldekort';
import { Alert, BodyShort, Box, HStack, Label, Loader } from '@navikt/ds-react';
import { MeldekortVarsler } from 'components/drift/sakogbehandling/meldekort/MeldekortVarsler';
import { MeldekortUtfyllinger } from 'components/drift/sakogbehandling/meldekort/MeldekortUtfyllinger';
import { MeldekortAktuelleMeldeperioder } from 'components/drift/sakogbehandling/meldekort/MeldekortAktuelleMeldeperioder';
import { MeldekortHistoriskeMeldeperioder } from 'components/drift/sakogbehandling/meldekort/MeldekortHistoriskeMeldeperioder';
import { formaterPeriodeV2, perioderErLike } from 'lib/utils/date';
import { Periode } from 'lib/types/felles';

export const Meldekort = ({
  saksnummer,
  sakRettighetsperiode,
}: {
  saksnummer: string;
  sakRettighetsperiode: Periode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<MeldekortDriftsinfoDto>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (saksnummer) {
        await hentMeldekortDriftsinfo(saksnummer)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((result: MeldekortDriftsinfoDto) => {
            setData(result);
          })
          .catch((err) => setError(`Noe gikk galt: ${err}`))
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [saksnummer]);

  if (isLoading) return <Loader />;

  return (
    <Box padding="space-16">
      {error && <Alert variant="error">{error}</Alert>}

      <Box
        background="info-soft"
        padding="space-16"
        marginBlock="space-16"
        borderRadius="16"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <HStack gap="space-16">
          <div>
            <Label>Status</Label>
            <BodyShort>{data?.sak.status}</BodyShort>
          </div>
          <div>
            <Label>Rettighetsperiode</Label>
            <BodyShort>{data?.sak.rettighetsperiode && formaterPeriodeV2(data.sak.rettighetsperiode)}</BodyShort>
          </div>
          {data && !perioderErLike(data.sak.rettighetsperiode, sakRettighetsperiode) && (
            <Alert variant="warning">
              Rettighetsperioden lagret i meldekort-backend samsvarer ikke med den i behandlingsflyt. Dette må
              korrigeres manuelt i databasen til meldekort-backend.
            </Alert>
          )}
        </HStack>
      </Box>

      <MeldekortAktuelleMeldeperioder
        saksnummer={saksnummer}
        aktuelleMeldeperioder={data?.aktuelleMeldeperioder || []}
      />

      <MeldekortHistoriskeMeldeperioder historiskeMeldeperioder={data?.historiskeMeldeperioder || []} />

      <MeldekortUtfyllinger utfyllinger={data?.utfyllinger || []} />

      <MeldekortVarsler varsler={data?.varsler || []} />
    </Box>
  );
};
