/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { ReactNode } from 'react'
import { Button, ButtonProps, ButtonVariation, Container, Heading, Layout, Text } from '@harness/uicore'
import { Icon, IconName, IconProps } from '@harness/icons'
import type { LayoutProps } from '@harness/uicore/dist/layouts/Layout'
import { Color, FontVariation } from '@harness/design-system'
import css from './NoData.module.scss'

export interface NoDataProps extends LayoutProps {
  imageURL?: string
  icon?: IconName
  iconProps?: Partial<IconProps>
  message: string
  description?: ReactNode
  width?: number | string
  imgWidth?: number
  buttonText?: string
  buttonWidth?: number
  onClick?: ButtonProps['onClick']
  buttonProps?: ButtonProps
}

export const NoData: React.FC<NoDataProps> = ({
  imageURL,
  icon,
  iconProps = {},
  message,
  description,
  width,
  imgWidth,
  buttonText,
  buttonWidth,
  onClick,
  buttonProps,
  children,
  ...props
}) => {
  return (
    <Layout.Vertical flex={{ justifyContent: 'center' }} spacing="xlarge" width={width || 540} {...props}>
      {imageURL && <img src={imageURL} width={imgWidth || 320} height={220} alt="" data-testid="nodata-image" />}
      {!imageURL && icon && <Icon name={icon} size={48} color={Color.GREY_600} {...iconProps} />}

      <Container>
        <Layout.Vertical spacing="medium">
          <Heading
            data-testid="nodata-heading"
            className={css.centerAlign}
            level={2}
            font={{ variation: FontVariation.H3 }}
            color={Color.GREY_600}
          >
            {message}
          </Heading>

          {description && (
            <Text className={css.centerAlign} font={{ variation: FontVariation.BODY1 }} color={Color.GREY_600}>
              {description}
            </Text>
          )}
        </Layout.Vertical>
      </Container>

      {buttonText && (
        <Button
          intent="primary"
          variation={ButtonVariation.PRIMARY}
          text={buttonText}
          width={buttonWidth}
          onClick={onClick}
          {...buttonProps}
        />
      )}

      {children}
    </Layout.Vertical>
  )
}
