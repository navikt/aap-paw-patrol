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
