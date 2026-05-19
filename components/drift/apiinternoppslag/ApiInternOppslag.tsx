'use client';
import {
  Box,
  DatePicker,
  HStack,
  TextField,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import { useState } from 'react';
import { DsopVedtak } from './DsopVedtak';
import { MaksimumUtenUtbetaling } from './MaksimumUtenUtbetaling';

export const ApiInternOppslag = () => {
  const defaultFom = new Date();
  defaultFom.setFullYear(new Date().getFullYear() - 2);
  const defaultTom = new Date();
  defaultTom.setFullYear(new Date().getFullYear() + 2);

  const [fnr, setFnr] = useState<string>();

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
      <DsopVedtak fnr={fnr} fom={fom} tom={tom}/>
      <MaksimumUtenUtbetaling fnr={fnr} fom={fom} tom={tom} />
    </VStack>
  );
};
