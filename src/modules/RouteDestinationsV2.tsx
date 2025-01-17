/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom'
import { Container, Layout } from '@harness/uicore'
import { isUndefined } from 'lodash-es'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import routes from '@common/RouteDefinitionsV2'
import { SideNav } from '@common/navigation/SideNavV2/SideNavV2'
import { NAV_MODE, accountPathProps, isNavMode } from '@common/utils/routeUtils'
import AdminSideNav from '@common/navigation/SideNavs/AdminSideNav/AdminSideNav'
import AllModeSideNav from '@common/navigation/SideNavs/AllModeSideNav/AllModeSideNav'
import DashboardsSideNav from '@common/navigation/SideNavs/DashboardsSideNav/DashboardsSideNav'
import ModuleSideNavLinks from '@common/navigation/SideNavs/ModuleSideNav/ModuleSideNav'
import { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import AdminRouteDestinations from '@projects-orgs/AdminRouteDestinations'
import DashboardRouteDestinations from '@dashboards/RouteDestinationsV2'
import { ModulesRouteDestinations } from '@modules/ModuleRouteConfig'
import AllModeRouteDestinations from '@modules/AllModeRouteDestinations'
import NotFoundPage from '@common/pages/404/NotFoundPage'
import { Module } from 'framework/types/ModuleName'
import WelcomePage from '@common/pages/welcome/WelcomePage'
import { RouteWithContext } from '@common/router/RouteWithContext/RouteWithContext'
import IDPRouteDestinations from '@idp/IDPRouteDestination'
import IDPAdminRouteDestinations from '@idp/IDPAdminRouteDestination'
import IDPAdminSideNavLinks from '@idp/components/IDPSideNav/IDPAdminSideNavLinks'

const RedirectToMode = ({ mode }: { mode?: NAV_MODE }): React.ReactElement => {
  const { module, accountId, path, projectIdentifier, orgIdentifier } = useParams<
    ModulePathParams & ProjectPathProps & { path: string }
  >()

  const locationParams = useLocation()
  const { currentMode } = useAppStore()
  const finalMode =
    mode || (currentMode && isNavMode(currentMode) ? currentMode : module ? NAV_MODE.MODULE : NAV_MODE.ADMIN)

  return (
    <Redirect
      to={{
        ...locationParams,
        pathname: `${routes.replace({
          accountId,
          mode: finalMode || (module ? NAV_MODE.MODULE : NAV_MODE.ADMIN),
          orgIdentifier,
          projectIdentifier,
          module,
          path
        })}`
      }}
    />
  )
}

const RedirectHomeRoutes = (): React.ReactElement => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ModulePathParams & ProjectPathProps>()

  return (
    <Switch>
      <Route path="/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/details">
        <Redirect to={routes.toProjectDetails({ projectIdentifier, orgIdentifier, accountId, mode: NAV_MODE.ADMIN })} />
      </Route>
      <Route path="/account/:accountId/home/projects/all">
        <Redirect to={routes.toProjects({ accountId, mode: NAV_MODE.ADMIN })} />
      </Route>
      <Route path="/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/services*">
        <Redirect to={routes.toSettingsServices({ mode: NAV_MODE.ALL, projectIdentifier, orgIdentifier })} />
      </Route>
      <Route path="/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/environments*">
        <Redirect to={routes.toSettingsEnvironments({ mode: NAV_MODE.ALL, projectIdentifier, orgIdentifier })} />
      </Route>
      <Route path="/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/monitoredservices*">
        <Redirect to={routes.toMonitoredServicesSettings({ mode: NAV_MODE.ALL, projectIdentifier, orgIdentifier })} />
      </Route>
      <Route path="/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/:path*">
        <RedirectToMode mode={NAV_MODE.ALL} />
      </Route>
    </Switch>
  )
}

const RedirectHomeSetupRoutes = (): React.ReactElement => {
  const { module, accountId, path, projectIdentifier, orgIdentifier } = useParams<
    ModulePathParams & ProjectPathProps & { path: string; isSetup: string }
  >()

  const locationParams = useLocation()
  const { currentMode, currentModule: moduleFromAppStore } = useAppStore()
  const finalModule = module || (moduleFromAppStore as Module)
  let finalMode = currentMode && isNavMode(currentMode) ? currentMode : finalModule ? NAV_MODE.MODULE : NAV_MODE.ADMIN

  // if mode in module and no module is present then convert to ADMIN mode
  finalMode = finalMode === NAV_MODE.MODULE && isUndefined(finalModule) ? NAV_MODE.ADMIN : finalMode

  return (
    <Redirect
      to={{
        ...locationParams,
        pathname: `${routes.toSettings({
          mode: finalMode,
          accountId,
          orgIdentifier,
          projectIdentifier,
          module: finalModule
        })}/${path || ''}`
      }}
    />
  )
}

const RedirectResourcesToSettings = (): React.ReactElement => {
  const { path, accountId, module, orgIdentifier, projectIdentifier } = useParams<
    ProjectPathProps & { path: string } & ModulePathParams
  >()
  const locationParams = useLocation()
  const { currentMode, currentModule: moduleFromAppStore } = useAppStore()
  const finalMode = currentMode && isNavMode(currentMode) ? currentMode : module ? NAV_MODE.MODULE : NAV_MODE.ADMIN

  if (finalMode === NAV_MODE.MODULE && moduleFromAppStore) {
    return (
      <Redirect
        to={{
          ...locationParams,
          pathname: `${routes.toSettings({
            mode: finalMode,
            accountId,
            orgIdentifier,
            projectIdentifier,
            module: module || (moduleFromAppStore as Module)
          })}/${path || ''}`
        }}
      />
    )
  }

  return (
    <Redirect
      to={{
        ...locationParams,
        pathname: `${routes.toSettings({ mode: finalMode, accountId, orgIdentifier, projectIdentifier, module })}/${
          path || ''
        }`
      }}
    />
  )
}

export const OldNavRedirects = (): JSX.Element => {
  return (
    <>
      <Route exact path={['/account/:accountId/main-dashboard']}>
        <Redirect to={routes.toMode({ mode: NAV_MODE.ALL, noscope: true })} />
      </Route>

      <Route
        exact
        path={[
          '/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/:isSetup(setup)/resources/:path*',
          '/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/:isSetup(setup)/:path*'
        ]}
      >
        <RedirectHomeSetupRoutes />
      </Route>

      {/* home path redirects */}
      <Route
        path={[
          '/account/:accountId/home/orgs/:orgIdentifier/projects/:projectIdentifier/',
          '/account/:accountId/home/*'
        ]}
      >
        <RedirectHomeRoutes />
      </Route>

      {/* old setup & settings path redirects */}
      <Route
        path={[
          '/account/:accountId/:module(cd|ci|cv|cf|ce|code|sto|chaos|iacm|ssca|idp|cet|sei)/orgs/:orgIdentifier/projects/:projectIdentifier/setup/resources/:path*',
          '/account/:accountId/:module(cd|ci|cv|cf|ce|code|sto|chaos|iacm|ssca|idp|cet|sei)/orgs/:orgIdentifier/projects/:projectIdentifier/setup/:path*',
          '/account/:accountId/settings/organizations/:orgIdentifier/setup/resources/:path*',
          '/account/:accountId/settings/organizations/:orgIdentifier/setup/:path*',
          '/account/:accountId/settings/resources/:path*',
          '/account/:accountId/settings/:path*'
        ]}
      >
        <RedirectResourcesToSettings />
      </Route>

      {/* module path */}
      <Route
        exact
        path={[
          '/account/:accountId/:module(cd|ci|cv|cf|ce|code|sto|chaos|iacm|ssca|idp|cet|sei)/orgs/:orgIdentifier/projects/:projectIdentifier/:path*',
          '/account/:accountId/:module(cd|ci|cv|cf|ce|code|sto|chaos|iacm|ssca|idp|cet|sei)/orgs/:orgIdentifier/:path*',
          '/account/:accountId/:module(cd|ci|cv|cf|ce|code|sto|chaos|iacm|ssca|idp|cet|sei)/:path*',
          '/account/:accountId'
        ]}
      >
        <RedirectToMode />
      </Route>
    </>
  )
}

const RoutesV2 = (): React.ReactElement => {
  return (
    <Switch>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.ADMIN })}>
        <Layout.Horizontal>
          <SideNav>
            <AdminSideNav />
          </SideNav>
          <Container style={{ flex: 1 }}>
            <AdminRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.ALL })}>
        <Layout.Horizontal>
          <SideNav>
            <AllModeSideNav />
          </SideNav>
          <Container style={{ flex: 1 }}>
            <AllModeRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.DASHBOARDS })}>
        <Layout.Horizontal>
          <SideNav>
            <DashboardsSideNav />
          </SideNav>
          <Container style={{ flex: 1 }}>
            <DashboardRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.MODULE, module: ':module(idp)' })}>
        <Layout.Horizontal>
          <Container style={{ flex: 1 }}>
            <IDPRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.MODULE, module: ':module(idp-admin)' })}>
        <Layout.Horizontal>
          <SideNav>
            <IDPAdminSideNavLinks />
          </SideNav>
          <Container style={{ flex: 1 }}>
            <IDPAdminRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>
      <Route path={routes.toMode({ ...accountPathProps, mode: NAV_MODE.MODULE })}>
        <Layout.Horizontal>
          <SideNav>
            <ModuleSideNavLinks />
          </SideNav>
          <Container style={{ flex: 1 }}>
            <ModulesRouteDestinations />
          </Container>
        </Layout.Horizontal>
      </Route>

      <RouteWithContext path={routes.toPurpose({ ...accountPathProps })} exact>
        <WelcomePage />
      </RouteWithContext>

      <Route component={() => <NotFoundPage redirectTo="/" />} />
    </Switch>
  )
}

export default RoutesV2
