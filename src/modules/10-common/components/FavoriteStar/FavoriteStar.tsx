/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { Color } from '@harness/design-system'
import { Icon } from '@harness/icons'
import {
  createFavorite as createFavoritePromise,
  deleteFavorite as deleteFavoritePromise,
  DeleteFavoriteProjectQueryParams
} from '@harnessio/react-ng-manager-client'
import { PopoverInteractionKind } from '@blueprintjs/core'
import React, { useState } from 'react'
import { Text, Utils, useToaster } from '@harness/uicore'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import type { Module } from 'framework/types/ModuleName'
import { useStrings } from 'framework/strings'
import type { ResourceScope } from 'services/cd-ng'
import type { ModulePathParams } from '@common/interfaces/RouteInterfaces'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import css from './FavoriteStar.module.scss'

interface FavoriteStarProps {
  resourceId: string
  resourceType: DeleteFavoriteProjectQueryParams['resource_type']
  module?: Module
  isFavorite?: boolean
  scope?: ResourceScope
  activeClassName?: string
  className?: string
  onChange?: (favorite: boolean) => void
}

const FavoriteStar: React.FC<FavoriteStarProps> = props => {
  const [isFavorite, setIsFavorite] = useState<boolean>(Boolean(props.isFavorite))
  const [apiInProgress, setAPIInProgress] = useState<boolean>(false)
  const { currentUserInfo } = useAppStore()
  const { PL_FAVORITES } = useFeatureFlags()
  const { showError } = useToaster()
  const { getString } = useStrings()
  const { module } = useParams<ModulePathParams>()
  const { accountIdentifier: accountId, projectIdentifier, orgIdentifier } = props.scope || {}

  const deleteFavorite = async (): Promise<void> => {
    try {
      setAPIInProgress(true)
      const response = await deleteFavoritePromise({
        pathParams: { 'user-id': currentUserInfo.uuid, org: orgIdentifier, project: projectIdentifier },
        queryParams: {
          resource_id: props.resourceId,
          resource_type: props.resourceType
        }
      })
      if (!response) {
        setIsFavorite(true)
        showError(getString('common.errorUnFavorite'))
      } else {
        props.onChange?.(false)
        setIsFavorite(false)
      }
    } catch (error) {
      showError(getString('common.errorUnFavorite'))
      setIsFavorite(true)
    } finally {
      setAPIInProgress(false)
    }
  }

  const createFavorite = async (): Promise<void> => {
    try {
      setAPIInProgress(true)
      const response = await createFavoritePromise({
        body: {
          user_id: currentUserInfo.uuid,
          resource_id: props.resourceId,
          resource_type: props.resourceType,
          module: module ? module.toUpperCase() : 'CORE',
          account: accountId,
          project: projectIdentifier,
          org: orgIdentifier
        },
        pathParams: {
          org: orgIdentifier,
          project: projectIdentifier
        }
      })

      if (!response) {
        showError(getString('common.errorFavorite'))
        setIsFavorite(false)
      } else {
        setIsFavorite(true)
        props.onChange?.(true)
      }
    } catch (error) {
      showError(getString('common.errorFavorite'))
      setIsFavorite(false)
    } finally {
      setAPIInProgress(false)
    }
  }

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.stopPropagation()

    if (!apiInProgress) {
      setIsFavorite(!isFavorite)

      if (isFavorite) {
        deleteFavorite()
      } else {
        createFavorite()
      }
    }
  }

  const { activeClassName = '' } = props

  if (!PL_FAVORITES) {
    return null
  }

  return (
    <Utils.WrapOptionalTooltip
      tooltip={
        <Text color={Color.GREY_100} padding="small">
          {isFavorite ? getString('common.favorite.remove') : getString('common.favorite.add')}
        </Text>
      }
      tooltipProps={{ isDark: true, interactionKind: PopoverInteractionKind.HOVER }}
    >
      <Icon
        name={isFavorite ? 'star' : 'star-empty'}
        color={isFavorite ? Color.YELLOW_700 : Color.GREY_400}
        size={24}
        onClick={handleClick}
        className={classNames(css.star, props.className, { [activeClassName]: isFavorite })}
        padding="xsmall"
      />
    </Utils.WrapOptionalTooltip>
  )
}

export default FavoriteStar
