import { useEffect, useState } from 'react';
import { hentVilkår } from 'lib/clientApi';
import { ExpansionCard, Table, Tag, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { capitalize } from 'lib/utils/formatting';
import { VilkårDriftsinfoDTO } from 'lib/types/vilkår';

export const Vilkårsresultat = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [vilkår, setVilkår] = useState<VilkårDriftsinfoDTO[]>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (behandlingsreferanse) {
        await hentVilkår(behandlingsreferanse)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((vilkår: VilkårDriftsinfoDTO[]) => setVilkår(vilkår));
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlingsreferanse]);

  return (
    <VStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
      {vilkår?.map((v, i) => <VilkårKort key={`${v.type}-${i}`} vilkår={v} />)}
    </VStack>
  );
};

const VilkårKort = ({ vilkår }: { vilkår: VilkårDriftsinfoDTO }) => {
  return (
    <ExpansionCard aria-label={vilkår.type} defaultOpen={true} size="small">
      <ExpansionCard.Header>
        <ExpansionCard.Title>{capitalize(vilkår.type)}</ExpansionCard.Title>
        <ExpansionCard.Description>
          Vurdert:{' '}
          {vilkår.vurdertTidspunkt ? formaterDatoMedTidspunktSekunderForFrontend(vilkår.vurdertTidspunkt) : 'N/A'}
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        {!vilkår.perioder.length ? (
          'Ingen perioder vurdert'
        ) : (
          <Table size="small">
            <Table.Header>
              <Table.HeaderCell style={{ width: '15rem' }}>Periode</Table.HeaderCell>
              <Table.HeaderCell>Utfall</Table.HeaderCell>
              <Table.HeaderCell>Manuell vurdering</Table.HeaderCell>
              <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
              <Table.HeaderCell>Innvilgelsesårsak</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {vilkår.perioder.map((periode: any) => (
                <Table.Row key={crypto.randomUUID()}>
                  <Table.DataCell>
                    {formaterDatoForFrontend(periode.periode.fom)} - {formaterDatoForFrontend(periode.periode.tom)}
                  </Table.DataCell>
                  <Table.DataCell>{tag(periode.utfall)}</Table.DataCell>
                  <Table.DataCell>{periode.manuellVurdering}</Table.DataCell>
                  <Table.DataCell>{periode.avslagsårsak}</Table.DataCell>
                  <Table.DataCell>{periode.innvilgelsesårsak}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

const tag = (utfall: string) => {
  switch (utfall) {
    case 'OPPFYLT':
      return (
        <Tag size="small" variant="success">
          {utfall}
        </Tag>
      );
    case 'IKKE_OPPFYLT':
      return (
        <Tag size="small" variant="error">
          {utfall}
        </Tag>
      );
    default:
      return (
        <Tag size="small" variant="neutral">
          {utfall}
        </Tag>
      );
  }
};
