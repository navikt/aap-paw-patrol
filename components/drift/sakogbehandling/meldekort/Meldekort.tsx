import { useEffect, useState } from 'react';
import { hentMeldekortDriftsinfo } from 'lib/clientApi';
import { MeldekortDriftsinfoDto } from 'lib/types/meldekort';
import { Alert, Box, Heading, Loader, Table } from '@navikt/ds-react';
import {
  formaterDatoForFrontend,
  formaterDatoMedTidspunktSekunderForFrontend,
  formaterPeriodeV2,
} from 'lib/utils/date';

export const Meldekort = ({ saksnummer }: { saksnummer: string }) => {
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
        background="neutral-soft"
        padding="space-16"
        marginBlock="space-16"
        borderRadius="16"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <Heading size="medium" textColor="subtle" spacing>
          Utfyllinger ({data?.utfyllinger?.length ?? 0})
        </Heading>

        {!data?.utfyllinger?.length ? (
          <Alert variant="info">Ingen utfyllinger funnet</Alert>
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
                <Table.HeaderCell scope="col">Fagsystem</Table.HeaderCell>
                <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">Flyt</Table.HeaderCell>
                <Table.HeaderCell scope="col">Aktivt steg</Table.HeaderCell>
                <Table.HeaderCell scope="col">Digitalisert</Table.HeaderCell>
                <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.utfyllinger.map((utfylling) => (
                <Table.Row key={utfylling.referanse}>
                  <Table.DataCell>{utfylling.referanse}</Table.DataCell>
                  <Table.DataCell>{utfylling.fagsak.system}</Table.DataCell>
                  <Table.DataCell>{utfylling.fagsak.nummer.asString}</Table.DataCell>
                  <Table.DataCell>{formaterPeriodeV2(utfylling.periode)}</Table.DataCell>
                  <Table.DataCell>{utfylling.flyt}</Table.DataCell>
                  <Table.DataCell>{utfylling.aktivtSteg}</Table.DataCell>
                  <Table.DataCell>
                    {utfylling.erDigitalisert === null ? '-' : utfylling.erDigitalisert ? 'Ja' : 'Nei'}
                  </Table.DataCell>
                  <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(utfylling.opprettet)}</Table.DataCell>
                  <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(utfylling.sistEndret)}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Box>

      <Box
        background="neutral-soft"
        padding="space-16"
        marginBlock="space-16"
        borderRadius="16"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <Heading size="medium" textColor="subtle" spacing>
          Varsler ({data?.varsler?.length ?? 0})
        </Heading>

        {!data?.varsler?.length ? (
          <Alert variant="info">Ingen varsler funnet</Alert>
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Varsel ID</Table.HeaderCell>
                <Table.HeaderCell scope="col">Type varsel</Table.HeaderCell>
                <Table.HeaderCell scope="col">Type varsel om</Table.HeaderCell>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                <Table.HeaderCell scope="col">Sendingstidspunkt</Table.HeaderCell>
                <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.varsler.map((varsel) => (
                <Table.Row key={varsel.varselId.id}>
                  <Table.DataCell>{varsel.varselId.id}</Table.DataCell>
                  <Table.DataCell>{varsel.typeVarsel}</Table.DataCell>
                  <Table.DataCell>{varsel.typeVarselOm}</Table.DataCell>
                  <Table.DataCell>
                    {formaterDatoForFrontend(varsel.forPeriode.fom)} – {formaterDatoForFrontend(varsel.forPeriode.tom)}
                  </Table.DataCell>
                  <Table.DataCell>{varsel.status}</Table.DataCell>
                  <Table.DataCell>
                    {formaterDatoMedTidspunktSekunderForFrontend(varsel.sendingstidspunkt)}
                  </Table.DataCell>
                  <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(varsel.opprettet)}</Table.DataCell>
                  <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(varsel.sistEndret)}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Box>
    </Box>
  );
};
