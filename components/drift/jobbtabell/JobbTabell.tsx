'use client';

import React, { useState } from 'react';
import { BodyShort, HStack, Label, Table, Button, VStack } from '@navikt/ds-react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { kjørJobb } from '../../../lib/clientApi';

interface Props {
  appNavn?: AppNavn;
  jobber: JobbInfo[];
}

export const JobbTabell = ({ jobber, appNavn }: Props) => {
  const [isLoadingKjørJobb, setIsLoadingKjørJobb] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  async function onKjørJobbClick(id: number) {
    setIsLoadingKjørJobb(true);
    try {
      const kjørRes = await kjørJobb(appNavn!, id);
      if (kjørRes.ok) {
        const message = await kjørRes.text();
        setMessage(message);
      } else {
        const message = await kjørRes.text();
        setMessage(message);
      }
    } catch (err) {
      console.log('err', err);
      setMessage('Noe gikk galt');
      setIsLoadingKjørJobb(false);
    }
    setIsLoadingKjørJobb(false);
  }

  return (
    <VStack gap="space-16">
      <Table size="small" zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col" />
            <Table.HeaderCell scope="col">Id</Table.HeaderCell>
            <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kjøretidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Antall feilende forsøk</Table.HeaderCell>
            {appNavn && <Table.HeaderCell scope="col"></Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {jobber.map((jobb) => {
            return (
              <Table.ExpandableRow
                key={jobb.id}
                content={
                  <HStack>
                    <VStack gap="space-16">
                      <div>
                        <Label>Beskrivelse</Label>
                        <BodyShort>{jobb.beskrivelse}</BodyShort>
                      </div>
                      {jobb.feilmelding && (
                        <div>
                          <Label>Feilmelding</Label>
                          <BodyShort>{jobb.feilmelding}</BodyShort>
                        </div>
                      )}
                    </VStack>
                    <VStack gap="space-16">
                      {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                        return (
                          <div key={key}>
                            <Label>{key}</Label>
                            <BodyShort>{value}</BodyShort>
                          </div>
                        );
                      })}
                    </VStack>
                  </HStack>
                }
              >
                <Table.DataCell>{jobb.id}</Table.DataCell>
                <Table.DataCell>{jobb.navn}</Table.DataCell>
                <Table.DataCell>{jobb.status}</Table.DataCell>
                <Table.DataCell>
                  {formaterDatoMedTidspunktSekunderForFrontend(jobb.planlagtKjøretidspunkt)}
                </Table.DataCell>
                <Table.DataCell>{jobb.antallFeilendeForsøk}</Table.DataCell>
                {appNavn && (
                  <Table.DataCell>
                    <Button size="small" loading={isLoadingKjørJobb} onClick={() => onKjørJobbClick(jobb.id)}>
                      Kjør nå
                    </Button>
                  </Table.DataCell>
                )}
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </Table>
      {message && <BodyShort>{message}</BodyShort>}
    </VStack>
  );
};

export function objectToMap(value: Object): Map<string, string> {
  return new Map(Object.entries(value));
}
