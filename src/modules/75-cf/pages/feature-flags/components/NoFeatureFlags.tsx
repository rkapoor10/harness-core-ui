/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FC, ReactNode } from 'react'
import { ButtonProps, Container, Text } from '@harness/uicore'
import { FontVariation } from '@harness/design-system'
import FlagDialog from '@cf/components/CreateFlagDialog/FlagDialog'
import { NoData } from '@cf/components/NoData/NoData'
import type { Tag } from 'services/cf'
import { useStrings, String } from 'framework/strings'
import noFlagsImg from '@cf/images/Feature_Flags_Teepee.svg'
import noResultsImg from '@cf/images/EmptySearchResults.svg'
import GetStartedWithFF from '@cf/components/GetStartedWithFF/GetStartedWithFF'
import FlagsSectionNoData from './FlagsSectionNoData'
import css from './NoFeatureFlags.module.scss'

export interface NoFeatureFlagsProps {
  hasFeatureFlags: boolean
  hasSearchTerm: boolean
  hasFlagFilter: boolean
  environmentIdentifier: string
  clearFilter: () => void
  clearSearch: () => void
  tags?: Tag[]
  tagsError?: unknown
}

export const NoFeatureFlags: FC<NoFeatureFlagsProps> = ({
  hasFeatureFlags,
  hasSearchTerm,
  hasFlagFilter,
  environmentIdentifier,
  clearFilter,
  clearSearch,
  tags = [],
  tagsError = null
}) => {
  const { getString } = useStrings()

  const mainMessage = (): string => {
    if (hasFlagFilter) return getString('common.filters.noMatchingFilterData')
    if (hasSearchTerm) return getString('cf.noResultMatch')

    return ''
  }

  const buttonText = (): string => {
    if (hasFlagFilter) return getString('cf.featureFlags.resetFilters')
    if (hasSearchTerm) return getString('cf.featureFlags.clearSearch')
    return ''
  }

  const buttonProps = (): ButtonProps => {
    if (hasFlagFilter) {
      return {
        text: getString('cf.featureFlags.resetFilters'),
        icon: 'reset',
        minimal: true,
        onClick: clearFilter
      }
    }
    if (hasSearchTerm) {
      return {
        text: getString('cf.featureFlags.clearSearch'),
        icon: 'x',
        iconProps: { size: 10 },
        minimal: true,
        onClick: clearSearch
      }
    }
    return {}
  }

  const additionalContent = (): ReactNode => {
    if (hasFeatureFlags && hasFlagFilter) {
      return <Text font={{ variation: FontVariation.BODY1 }}>{getString('cf.featureFlags.changeOrReset')}</Text>
    }
    if (!hasFeatureFlags) {
      return (
        <>
          <div className={css.noFlagsDescription}>
            <String stringID="cf.featureFlags.flagsDescription" />
          </div>
          <div className={css.noFlagsToGetStarted}>
            <String useRichText stringID="cf.featureFlags.noFlagsToGetStarted" />
          </div>
          <GetStartedWithFF />
          <FlagDialog environment={environmentIdentifier} isLinkVariation tags={tags} tagsError={tagsError} />
        </>
      )
    }
  }

  if (hasSearchTerm || hasFlagFilter) {
    return (
      <Container flex={{ justifyContent: 'center' }} padding="xxxlarge">
        <NoData
          imageURL={hasFeatureFlags && (hasSearchTerm || hasFlagFilter) ? noResultsImg : noFlagsImg}
          message={mainMessage()}
          description={additionalContent()}
          buttonText={buttonText()}
          buttonProps={buttonProps()}
          padding="xxxlarge"
          width="570px"
        />
      </Container>
    )
  }
  return (
    <Container width="100%" height="100%" flex={{ align: 'center-center' }}>
      <FlagsSectionNoData>
        <FlagDialog environment={environmentIdentifier} isLinkVariation tags={tags} tagsError={tagsError} />
      </FlagsSectionNoData>
    </Container>
  )
}
