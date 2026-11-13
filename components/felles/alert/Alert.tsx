import { ReactNode } from 'react';
import { Box, InfoCard, InfoCardProps } from '@navikt/ds-react';
import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { InfoCardMessage } from '@navikt/ds-react/InfoCard';

interface Props extends Omit<InfoCardProps, 'data-color'> {
  variant: 'warning' | 'info' | 'error' | 'success';
  children: ReactNode;
}

export const Alert = ({ variant, children, size = 'small', className, ...rest }: Props) => {
  return (
    <Box marginBlock="space-16">
      <InfoCard
        data-color={variant === 'error' ? 'danger' : variant}
        aria-label={`${variant} alert`}
        size={size}
        className={className}
        {...rest}
      >
        {
          {
            success: <InfoCardMessage icon={<CheckmarkCircleIcon aria-hidden />}>{children}</InfoCardMessage>,
            warning: <InfoCardMessage icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCardMessage>,
            info: <InfoCardMessage icon={<InformationSquareIcon aria-hidden />}>{children}</InfoCardMessage>,
            error: <InfoCardMessage icon={<XMarkOctagonIcon aria-hidden />}>{children}</InfoCardMessage>,
          }[variant]
        }
      </InfoCard>
    </Box>
  );
};
