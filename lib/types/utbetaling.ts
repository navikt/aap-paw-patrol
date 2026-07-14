export interface UtbetalingStatusDto {
  utbetalingerSomManglerKvittering: UtbetalingInfoDto[];
  utbetalingerMedFeiletStatus: UtbetalingInfoDto[];
}

export interface UtbetalingInfoDto {
  utbetalingRef: string;
  saksnummer: string;
  behandlingsreferanse: string;
  utbetalingStatus: string;
  utbetalingOpprettet: string;
  utbetalingEndret?: string | null;
}

export interface MigreringsStatusDto {
  antallGammeltApi: number;
  antallNyttApi: number;
}

export interface UtbetalingstidslinjeDto {
  utbetalinger: UtbetalingDto[];
}

export interface UtbetalingDto {
  fom: string;
  tom: string;
  utbetalingRef: string;
  beløp: number;
  fastsattDagsats: number;
  utbetalingsdato: string;
}
