import { useEffect, useState } from 'react';
import { hentYrkesskader } from 'lib/clientApi';
import { BodyShort, Box, HStack, Loader, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface YrkesskadeDriftsinfoDto {
  ref: string;
  saksnummer: number | null;
  kildesystem: string;
  skadedato: string | null;
  vedtaksdato: string | null;
}

export const Yrkesskader = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [yrkesskader, setYrkesskader] = useState<YrkesskadeDriftsinfoDto[]>();

  useEffect(() => {
    if (behandlingsreferanse) {
      hentYrkesskader(behandlingsreferanse)
        .then(async (res) => {
          if (res.ok) return await res.json();
          else throw Error(await res.text());
        })
        .then((data: YrkesskadeDriftsinfoDto[]) => setYrkesskader(data))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
        <Loader />
        <span>Henter yrkesskader for behandling ...</span>
      </HStack>
    );
  }

  if (!yrkesskader?.length) {
    return (
      <Box paddingBlock="space-32" paddingInline="space-16">
        <BodyShort>Ingen yrkesskader funnet for denne behandlingen</BodyShort>
      </Box>
    );
  }

  return (
    <Box paddingBlock="space-32" paddingInline="space-16">
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Referanse</Table.HeaderCell>
            <Table.HeaderCell>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell>Kildesystem</Table.HeaderCell>
            <Table.HeaderCell>Skadedato</Table.HeaderCell>
            <Table.HeaderCell>Vedtaksdato</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {yrkesskader.map((yrkesskade) => (
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
    </Box>
  );
};
