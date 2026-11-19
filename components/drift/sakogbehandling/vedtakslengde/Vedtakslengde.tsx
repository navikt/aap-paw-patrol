import { useEffect, useState } from 'react';
import { BodyShort, Heading, HStack, Loader, LocalAlert, Table, Tag, VStack } from '@navikt/ds-react';
import { FetchJsonBody, hentVedtakslengde } from 'lib/clientApi';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';

type VedtakslengdeVurderinger = FetchJsonBody<ReturnType<typeof hentVedtakslengde>>;

export const Vedtakslengde = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feil, setFeil] = useState<string>();
  const [vurderinger, setVurderinger] = useState<VedtakslengdeVurderinger>();

  useEffect(() => {
    if (behandlingsreferanse) {
      hentVedtakslengde(behandlingsreferanse)
        .then(async (res) => {
          if (res.ok) return await res.json();
          else throw Error(await res.text());
        })
        .then((data: VedtakslengdeVurderinger) => setVurderinger(data))
        .catch(() => setFeil('Kunne ikke hente vedtakslengde for behandlingen'))
        .finally(() => setIsLoading(false));
    }
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16" role="status">
        <Loader />
        <BodyShort>Henter vedtakslengde for behandling ...</BodyShort>
      </HStack>
    );
  }

  return (
    <VStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
      <Heading level="2" size="small">
        Vedtakslengde
      </Heading>
      {feil ? (
        <LocalAlert status="error">
          <LocalAlert.Header>
            <LocalAlert.Title>Feil ved henting av vedtakslengde</LocalAlert.Title>
            <LocalAlert.CloseButton onClick={() => setFeil(undefined)} />
          </LocalAlert.Header>
          <LocalAlert.Content>{feil}</LocalAlert.Content>


        </LocalAlert>
      ) : vurderinger?.length ? (
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Sluttdato</Table.HeaderCell>
              <Table.HeaderCell scope="col">Utvidet med</Table.HeaderCell>
              <Table.HeaderCell scope="col">Årsaker</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdert av</Table.HeaderCell>
              <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vurderinger.map((v) => (
              <Table.Row key={`${v.fom}-${v.tom}-${v.opprettet}`}>
                <Table.DataCell>
                  {formaterDatoForFrontend(v.fom)} - {formaterDatoForFrontend(v.tom)}
                </Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(v.sluttdato)}</Table.DataCell>
                <Table.DataCell>{capitalize(v.utvidetMed)}</Table.DataCell>
                <Table.DataCell>{v.årsaker.map(capitalize).join(', ') || '-'}</Table.DataCell>
                <Table.DataCell>
                  <HStack gap="space-8">
                    <Tag size="xsmall" variant={v.manuellVurdering ? 'info' : 'neutral'}>
                      {v.manuellVurdering ? 'Manuell' : 'Automatisk'}
                    </Tag>
                    {v.erNy && (
                      <Tag size="xsmall" variant="success">
                        Ny i behandlingen
                      </Tag>
                    )}
                  </HStack>
                </Table.DataCell>
                <Table.DataCell>{v.vurdertAv}</Table.DataCell>
                <Table.DataCell>{formaterDatoMedTidspunktSekunderForFrontend(v.opprettet)}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <BodyShort>Ingen vedtakslengdevurderinger funnet for denne behandlingen</BodyShort>
      )}
    </VStack>
  );
};
