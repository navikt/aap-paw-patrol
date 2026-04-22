'use client';
import {
  Box,
  Button,
  DatePicker,
  HStack,
  InlineMessage,
  Loader,
  LocalAlert,
  Table,
  TextField,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import { formatISO } from 'date-fns';
import { hentDsopVedtak } from 'lib/clientApi';
import { useState } from 'react';

interface DsopVedtakResponse {
  vedtak: DsopVedtak[];
}

interface DsopVedtak {
  virkningsperiode: { fom: string; tom?: string | null };
  aktivitetsfase: string;
  vedtakId: string;
  utfall: string;
  vedtakStatus: string;
  vedtaksType: string;
  vedtaksvariant?: string | null;
}

export const ApiInternOppslag = () => {
  const defaultFom = new Date();
  defaultFom.setFullYear(new Date().getFullYear() - 2);
  const defaultTom = new Date();
  defaultTom.setFullYear(new Date().getFullYear() + 2);

  const [fnr, setFnr] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const {
    datepickerProps: fomDatepickerProps,
    inputProps: fomInputProps,
    selectedDay: fom,
  } = useDatepicker({
    fromDate: new Date('Aug 23 2019'),
    defaultSelected: defaultFom,
  });

  const {
    datepickerProps: tomDatepickerProps,
    inputProps: tomInputProps,
    selectedDay: tom,
  } = useDatepicker({
    fromDate: new Date('Aug 23 2019'),
    defaultSelected: defaultTom,
  });

  const [dsopVedtak, setDsopVedtak] = useState<DsopVedtakResponse>();

  const onClickHentDsopVedtak = async () => {
    if (!fnr || !fom || !tom) {
      const mangler = [fnr ? null : 'fnr', fom ? null : 'fom', tom ? null : 'tom'].filter((it) => it);
      setError(`mangler verdi for ${mangler.join(', ')}`);
      return;
    }
    setError(undefined);
    setLoading(true);
    const response = await hentDsopVedtak(
      fnr,
      formatISO(fom, { representation: 'date' }),
      formatISO(tom, { representation: 'date' })
    );

    if (response.ok) {
      setDsopVedtak(await response.json());
    } else {
      setError(`http error ${response.statusText}`);
      setDsopVedtak(undefined);
    }
    setLoading(false);
  };

  return (
    <VStack gap="space-32" marginBlock="space-32">
      <form>
        <HStack gap="space-64">
          <Box maxWidth="13em">
            <TextField label="Fødselsnummer" inputMode="numeric" onBlur={(e) => setFnr(e.target.value)} />
          </Box>
          <Box>
            <DatePicker {...fomDatepickerProps}>
              <DatePicker.Input {...fomInputProps} label="Hent opplysninger fra og med" />
            </DatePicker>
          </Box>
          <Box>
            <DatePicker {...tomDatepickerProps}>
              <DatePicker.Input {...tomInputProps} label="Hent opplysninger til og med" />
            </DatePicker>
          </Box>
        </HStack>
      </form>

      <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="12" padding="space-16">
        <VStack gap="space-16">
          <Box maxWidth="20em">
            <Button onClick={onClickHentDsopVedtak}>Hent DSOP-vedtak</Button>
          </Box>

          {loading && <Loader size="3xlarge" />}

          {error && (
            <LocalAlert status="error">
              <LocalAlert.Header>
                <LocalAlert.Title>Feil ved henting av dsop-vedtak</LocalAlert.Title>
                <LocalAlert.CloseButton onClick={() => setError(undefined)}/>
              </LocalAlert.Header>
              <LocalAlert.Content>{error}</LocalAlert.Content>
            </LocalAlert>
          )}

          {dsopVedtak != null ? (
            dsopVedtak.length === 0 ? (
              <InlineMessage status="info">Ingen vedtak</InlineMessage>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col">fom</Table.HeaderCell>
                    <Table.HeaderCell scope="col">tom</Table.HeaderCell>
                    <Table.HeaderCell scope="col">id</Table.HeaderCell>
                    <Table.HeaderCell scope="col">status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">type</Table.HeaderCell>
                    <Table.HeaderCell scope="col">variant</Table.HeaderCell>
                    <Table.HeaderCell scope="col">utfall</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dsopVedtak.vedtak.map(
                    ({
                      virkningsperiode: { fom, tom },
                      vedtakId,
                      vedtakStatus,
                      vedtaksType,
                      vedtaksvariant,
                      utfall,
                    }) => {
                      return (
                        <Table.Row key={fom}>
                          <Table.DataCell>{fom}</Table.DataCell>
                          <Table.DataCell>{tom ?? ''}</Table.DataCell>
                          <Table.DataCell>{vedtakId}</Table.DataCell>
                          <Table.DataCell>{vedtakStatus}</Table.DataCell>
                          <Table.DataCell>{vedtaksType}</Table.DataCell>
                          <Table.DataCell>{vedtaksvariant}</Table.DataCell>
                          <Table.DataCell>{utfall}</Table.DataCell>
                        </Table.Row>
                      );
                    }
                  )}
                </Table.Body>
              </Table>
            )
          ) : null}
        </VStack>
      </Box>
    </VStack>
  );
};
