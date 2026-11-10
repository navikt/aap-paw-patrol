import { useEffect, useState } from 'react';
import { FetchJsonBody, hentYrkesskader } from 'lib/clientApi';
import { BodyShort, Heading, HStack, Loader, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

type YrkesskadeGrunnlagDriftsinfoDto = FetchJsonBody<ReturnType<typeof hentYrkesskader>>;
export const Yrkesskader = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [grunnlag, setGrunnlag] = useState<YrkesskadeGrunnlagDriftsinfoDto>();

  useEffect(() => {
    if (behandlingsreferanse) {
      hentYrkesskader(behandlingsreferanse)
        .then(async (res) => {
          if (res.ok) return await res.json();
          else throw Error(await res.text());
        })
        .then((data: YrkesskadeGrunnlagDriftsinfoDto) => setGrunnlag(data))
        .finally(() => setIsLoading(false));
    }
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
        <Loader />
        <BodyShort>Henter yrkesskader for behandling ...</BodyShort>
      </HStack>
    );
  }

  return (
    <VStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
      <Heading level="2" size="small">
        Yrkesskadevurdering
      </Heading>
      {grunnlag?.vurdering ? (
        <VStack as="section" gap="space-16">
          <VStack gap="space-8">
            <BodyShort>Årsakssammenheng: {grunnlag.vurdering.erÅrsakssammenheng ? 'Ja' : 'Nei'}</BodyShort>
            <BodyShort>
              Andel av nedsettelsen:{' '}
              {grunnlag.vurdering.andelAvNedsettelsen == null ? '-' : `${grunnlag.vurdering.andelAvNedsettelsen} %`}
            </BodyShort>
            <BodyShort>Har begrunnelse: {grunnlag.vurdering.harBegrunnelse ? 'Ja' : 'Nei'}</BodyShort>
          </VStack>

          <Heading level="3" size="small">
            Relevante saker
          </Heading>
          {grunnlag.vurdering.relevanteSaker.length > 0 ? (
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Manuell yrkesskadedato</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {grunnlag.vurdering.relevanteSaker.map((sak, index) => (
                  <Table.Row key={`${sak.referanse ?? 'skjermet'}-${index}`}>
                    <Table.DataCell>{sak.referanseSkjermet ? 'Skjermet' : (sak.referanse ?? '-')}</Table.DataCell>
                    <Table.DataCell>
                      {sak.manuellYrkesskadeDato ? formaterDatoForFrontend(sak.manuellYrkesskadeDato) : '-'}
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <BodyShort>Ingen relevante saker</BodyShort>
          )}
        </VStack>
      ) : (
        <BodyShort>Ingen vurdering registrert</BodyShort>
      )}

      <Heading level="2" size="small">
        Yrkesskader
      </Heading>
      {grunnlag?.yrkesskader.length ? (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Referanse</Table.HeaderCell>
              <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Kildesystem</Table.HeaderCell>
              <Table.HeaderCell scope="col">Skadedato</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vedtaksdato</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {grunnlag.yrkesskader.map((yrkesskade) => (
              <Table.Row key={yrkesskade.ref}>
                <Table.DataCell>{yrkesskade.ref}</Table.DataCell>
                <Table.DataCell>{yrkesskade.saksnummer ?? '-'}</Table.DataCell>
                <Table.DataCell>{yrkesskade.kildesystem}</Table.DataCell>
                <Table.DataCell>
                  {yrkesskade.skadedato ? formaterDatoForFrontend(yrkesskade.skadedato) : '-'}
                </Table.DataCell>
                <Table.DataCell>
                  {yrkesskade.vedtaksdato ? formaterDatoForFrontend(yrkesskade.vedtaksdato) : '-'}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <BodyShort>Ingen yrkesskader funnet for denne behandlingen</BodyShort>
      )}
    </VStack>
  );
};
