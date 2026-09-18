'use client';
import { Alert, BodyShort, CopyButton, HStack, Link, Loader, Table, Tag, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { hentKravOgStønadsperiode } from 'lib/clientApi';
import { capitalize } from 'lib/utils/formatting';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { KravDto, KravOgStønadsperiodeDto } from 'lib/types/kravOgStonadsperiode';

const kortReferanse = (referanse: string) => referanse.slice(0, 8);

const harÅrsak = (årsak?: string | null): årsak is string => !!årsak;

export const KravOgStønadsperiode = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [data, setData] = useState<KravOgStønadsperiodeDto>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);
    setData(undefined);

    hentKravOgStønadsperiode(behandlingsreferanse)
      .then(async (res) => {
        if (res.ok) return await res.json();
        throw Error(await res.text());
      })
      .then((res: KravOgStønadsperiodeDto) => setData(res))
      .catch((err) => setError(`Noe gikk galt: ${err}`))
      .finally(() => setIsLoading(false));
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
        <Loader />
        <span>Henter krav og stønadsperiode for behandling ...</span>
      </HStack>
    );
  }

  if (error) {
    return (
      <VStack paddingBlock="space-32" paddingInline="space-16">
        <Alert variant="error">{error}</Alert>
      </VStack>
    );
  }

  const krav = data?.krav ?? [];
  const stønadsperioder = data?.stønadsperioder ?? [];

  return (
    <VStack gap="space-32" paddingBlock="space-32" paddingInline="space-16">
      <VStack gap="space-16">
        <BodyShort weight="semibold">Krav</BodyShort>
        {krav.length === 0 ? (
          <Alert variant="info">Ingen krav funnet</Alert>
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Referanse</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Journalpost</Table.HeaderCell>
                <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
                <Table.HeaderCell>Overstyrt mulig rett fra</Table.HeaderCell>
                <Table.HeaderCell>Søknadsdato</Table.HeaderCell>
                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                <Table.HeaderCell>Vurdert av</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {krav.map((k) => (
                <Table.Row key={k.referanse}>
                  <Table.DataCell>
                    <CopyButton size="xsmall" iconPosition="right" copyText={k.referanse} text={kortReferanse(k.referanse)} />
                  </Table.DataCell>
                  <Table.DataCell>{formaterKravType(k.type)}</Table.DataCell>
                  <Table.DataCell>
                    {k.journalpostId ? (
                      <Link href={`/drift/postmottak/${k.journalpostId}`}>{k.journalpostId}</Link>
                    ) : (
                      '–'
                    )}
                  </Table.DataCell>
                  <Table.DataCell>{k.muligRettFra ? formaterDatoForFrontend(k.muligRettFra) : '–'}</Table.DataCell>
                  <Table.DataCell>
                    {k.overstyrMuligRettFra ? formaterDatoForFrontend(k.overstyrMuligRettFra) : '–'}
                    {harÅrsak(k.overstyrMuligRettFraÅrsak) && ` (${k.overstyrMuligRettFraÅrsak})`}
                  </Table.DataCell>
                  <Table.DataCell>
                    {k.søknadsdato ? formaterDatoForFrontend(k.søknadsdato) : '–'}
                    {harÅrsak(k.søknadsdatoÅrsak) && ` (${k.søknadsdatoÅrsak})`}
                  </Table.DataCell>
                  <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(k.opprettet)}</Table.DataCell>
                  <Table.DataCell>{k.vurdertAv}</Table.DataCell>
                  <Table.DataCell>
                    {k.erNy && (
                      <Tag size="small" variant="info">
                        Ny
                      </Tag>
                    )}
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </VStack>

      <VStack gap="space-16">
        <BodyShort weight="semibold">Stønadsperioder</BodyShort>
        {stønadsperioder.length === 0 ? (
          <Alert variant="info">Ingen stønadsperioder funnet</Alert>
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Kravreferanse</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Startdato</Table.HeaderCell>
                <Table.HeaderCell>Ordinær siste 52 uker</Table.HeaderCell>
                <Table.HeaderCell>Gjenværende kvote</Table.HeaderCell>
                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                <Table.HeaderCell>Vurdert av</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {stønadsperioder.map((s, i) => {
                const tilhørendeKrav = krav.find((k) => k.referanse === s.kravReferanse);
                const erGjeldende = tilhørendeKrav?.type === 'RELEVANT_KRAV';

                return (
                  <Table.Row key={i} style={!erGjeldende ? { opacity: 0.5 } : undefined}>
                    <Table.DataCell>
                      <span style={!erGjeldende ? { textDecoration: 'line-through' } : undefined}>
                        <CopyButton
                          size="xsmall"
                          iconPosition="right"
                          copyText={s.kravReferanse}
                          text={kortReferanse(s.kravReferanse)}
                        />
                      </span>
                      {!erGjeldende && (
                        <BodyShort size="small" textColor="subtle">
                          Ikke gjeldende – kravet er ikke lenger et relevant krav
                          {tilhørendeKrav ? ` (${formaterKravType(tilhørendeKrav.type)})` : ' (krav ikke funnet)'}
                        </BodyShort>
                      )}
                    </Table.DataCell>
                    <Table.DataCell>{capitalize(s.type)}</Table.DataCell>
                    <Table.DataCell>{formaterDatoForFrontend(s.startdato)}</Table.DataCell>
                    <Table.DataCell>{s.harHattOrdinærSiste52Uker ? 'Ja' : 'Nei'}</Table.DataCell>
                    <Table.DataCell>{s.harGjenværendeKvote ? 'Ja' : 'Nei'}</Table.DataCell>
                    <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(s.opprettet)}</Table.DataCell>
                    <Table.DataCell>{s.vurdertAv}</Table.DataCell>
                    <Table.DataCell>
                      {s.erNy && (
                        <Tag size="small" variant="info">
                          Ny
                        </Tag>
                      )}
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </VStack>
    </VStack>
  );
};

const formaterKravType = (type: KravDto['type']) => capitalize(type);
