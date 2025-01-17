/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { Position, PopoverInteractionKind } from '@blueprintjs/core'
import { matchPath, useHistory, useParams } from 'react-router-dom'
import cx from 'classnames'
import { defaultTo } from 'lodash-es'
import { Text, Container, Popover, Button, Tabs, Layout } from '@harness/uicore'
import { Color, FontVariation } from '@harness/design-system'
import { Scope } from 'framework/types/types'
import { Organization, Project } from 'services/cd-ng'
import { getRouteParams } from '@common/utils/routeUtils'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitionsV2'
import usePrimaryScopeSwitchDialog from '@common/navigation/SideNavV2/ScopeSwitchDialog/usePrimaryScopeSwitchDialog'
import { LinkInfo } from '@common/navigation/SideNavV2/SideNavV2'
import { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetSelectedScope } from '@common/navigation/SideNavV2/SideNavV2.utils'
import pointerImageDark from './pointer-dark.svg'
import { ProjectScopeSelector } from './ProjectScopeSelector/ProjectScopeSelector'
import { OrgScopeSelector } from './OrgScopeSelector/OrgScopeSelector'
import { AccountScopeSelector } from './AccountScopeSelector/AccountScopeSelector'
import css from './ScopeSelector.module.scss'

interface ScopeSelectorProps {
  isOpen: boolean
  onButtonClick: () => void
  onClose: () => void
  availableLinks: Record<Scope, LinkInfo[]>
  activeLink?: LinkInfo
}

export const ScopeSelector: React.FC<ScopeSelectorProps> = props => {
  const {
    isOpen: isScopeSelectorOpen,
    onButtonClick,
    onClose,
    availableLinks: possibleScopeSwitchLinksMap,
    activeLink
  } = props
  const { currentUserInfo, selectedProject, selectedOrg, accountInfo } = useAppStore()
  const { getString } = useStrings()
  const { accountId } = useParams<ProjectPathProps>()
  const { scope: selectedScope, params } = useGetSelectedScope()
  const [selectedTabId, setSelectedTabId] = React.useState<Scope | undefined>(selectedScope)
  const { path } = getRouteParams<ProjectPathProps & { path: string }>(true, activeLink?.url)
  const history = useHistory()
  const { showDialog: showPrimaryScopeSwitchDialog } = usePrimaryScopeSwitchDialog({ closeScopeSelector: onClose })

  const handleTabChange = (tabId: Scope): void => {
    setSelectedTabId(tabId)
  }

  const getTargetURL = (scope: Scope, data?: Project | Organization) => {
    if (scope === Scope.PROJECT) {
      const projectData = data as Project
      return routes.replace({
        orgIdentifier: projectData.orgIdentifier,
        projectIdentifier: projectData.identifier,
        path
      })
    } else if (scope === Scope.ORGANIZATION) {
      const orgData = data as Organization
      return routes.replace({ orgIdentifier: orgData.identifier, path })
    }

    return routes.replace({ orgIdentifier: undefined, projectIdentifier: undefined, path })
  }

  const renderSelectedScopeButtonContent = () => {
    const scopeInfoMap: Record<Scope, { label: string; identifier?: string; name?: string }> = {
      [Scope.PROJECT]: {
        label: getString('projectLabel').toUpperCase(),
        identifier: params?.projectIdentifier,
        name: selectedProject?.name
      },
      [Scope.ORGANIZATION]: {
        label: getString('common.organizations').toUpperCase(),
        identifier: params?.orgIdentifier,
        name: selectedOrg?.name
      },
      [Scope.ACCOUNT]: {
        label: getString('account').toUpperCase(),
        identifier: currentUserInfo?.accounts?.find(account => account.uuid === accountId)?.accountName,
        name: accountInfo?.name
      }
    }

    if (!selectedScope) {
      return (
        <Layout.Vertical>
          <Text className={css.scopeLabelText} color={Color.GREY_350}>
            {getString('projectLabel').toUpperCase()}
          </Text>
          <Text color={Color.GREY_800} font={{ variation: FontVariation.BODY }}>
            {getString('selectProject')}
          </Text>
        </Layout.Vertical>
      )
    }

    return (
      <>
        <Text className={css.scopeLabelText} color={Color.GREY_350}>
          {scopeInfoMap[selectedScope].label}
        </Text>
        <Text color={Color.GREY_1000} font={{ variation: FontVariation.BODY }} lineClamp={1}>
          {scopeInfoMap[selectedScope].name}
        </Text>
      </>
    )
  }

  const handleScopeChange = (targetScope: Scope, data?: Project | Organization): void => {
    const targetUrl = getTargetURL(targetScope, data)

    if (!selectedScope) {
      onClose()
      history.push(targetUrl)
      return
    }

    const scopeSwtichData = possibleScopeSwitchLinksMap?.[targetScope]?.find(availableLink => {
      return Boolean(
        matchPath(targetUrl, {
          path: availableLink.url
        })
      )
    })

    if (scopeSwtichData) {
      onClose()
      history.push(targetUrl)
      return
    } else {
      showPrimaryScopeSwitchDialog({
        targetScope,
        targetScopeParams:
          targetScope === Scope.PROJECT
            ? {
                projectIdentifier: data?.identifier || '',
                orgIdentifier: (data as Project).orgIdentifier || '',
                accountId
              }
            : targetScope === Scope.ORGANIZATION
            ? { orgIdentifier: data?.identifier || '', accountId }
            : undefined,
        pageName: activeLink?.label,
        link: activeLink?.scopeSwitchProps?.[targetScope]?.link,
        handleSelectScopeClick: () => {
          // show scope selector here
        }
      })
    }
  }

  return (
    <>
      <Container padding={{ top: 'medium', bottom: 'small' }}>
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.RIGHT}
          modifiers={{ offset: { offset: -50 } }}
          hasBackdrop={true}
          lazy={true}
          fill={true}
          popoverClassName={css.popover}
          isOpen={isScopeSelectorOpen}
          onOpening={() => setSelectedTabId(defaultTo(selectedScope, Scope.PROJECT))}
          onClose={onClose}
        >
          <Button
            minimal
            rightIcon="chevron-right"
            iconProps={{ color: Color.GREY_400 }}
            className={cx(css.selectButton, { [css.active]: isScopeSelectorOpen })}
            tooltipProps={{
              isDark: true,
              usePortal: true,
              fill: true
            }}
            tooltip={
              !selectedScope ? (
                <Text padding="small" color={Color.WHITE}>
                  {getString('selectProject')}
                </Text>
              ) : undefined
            }
            onClick={onButtonClick}
          >
            <Layout.Vertical spacing="xsmall">{renderSelectedScopeButtonContent()}</Layout.Vertical>
          </Button>
          <Container width={760} padding="xlarge" className={css.selectContainer}>
            <Tabs
              id="scopeSelector"
              onChange={handleTabChange}
              selectedTabId={selectedTabId}
              data-tabId={selectedTabId}
              tabList={[
                {
                  id: Scope.PROJECT,
                  title: getString('projectLabel'),
                  iconProps: { name: 'nav-project' },
                  panel: (
                    <ProjectScopeSelector
                      onClick={project => {
                        handleScopeChange(Scope.PROJECT, project.projectResponse.project)
                      }}
                    />
                  )
                },
                {
                  id: Scope.ORGANIZATION,
                  title: getString('orgLabel'),
                  iconProps: { name: 'nav-organization' },
                  panel: (
                    <OrgScopeSelector
                      onClose={() => onClose()}
                      onClick={(organization: Organization) => {
                        handleScopeChange(Scope.ORGANIZATION, organization)
                      }}
                    />
                  )
                },
                {
                  id: Scope.ACCOUNT,
                  title: getString('account'),
                  iconProps: { name: 'Account' },
                  panel: (
                    <AccountScopeSelector
                      clickOnLoggedInAccount={() => {
                        handleScopeChange(Scope.ACCOUNT)
                      }}
                    />
                  )
                }
              ]}
            />
          </Container>
        </Popover>
        {!selectedScope ? (
          <div style={{ backgroundImage: `url(${pointerImageDark})` }} className={css.pickScopeHelp}>
            <Text color={Color.GREY_450} font={{ variation: FontVariation.BODY }} padding="small">
              {getString('projectsOrgs.pickScope', { scope: selectedScope || Scope.PROJECT })}
            </Text>
          </div>
        ) : null}
      </Container>
    </>
  )
}
