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
        <InfoCardMessage
          icon={
            {
              success: <CheckmarkCircleIcon aria-hidden />,
              warning: <ExclamationmarkTriangleIcon aria-hidden />,
              info: <InformationSquareIcon aria-hidden />,
              error: <XMarkOctagonIcon aria-hidden />,
            }[variant]
          }
        >
          {children}
        </InfoCardMessage>
      </InfoCard>
    </Box>
  );
};
