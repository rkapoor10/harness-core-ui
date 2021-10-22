import React from 'react'
import { Layout, Text, FontVariation, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ChangeSummaryDTO } from 'services/cv'
import { ChangeSourceTypes } from '@cv/components/ChangeTimeline/ChangeTimeline.constants'
import { createTooltipLabel } from '@cv/components/ChangeTimeline/ChangeTimeline.utils'
import css from '../../CVMonitoredService.module.scss'

export const GraphServiceChanges = ({ changeSummary }: { changeSummary?: ChangeSummaryDTO }): JSX.Element => {
  const { getString } = useStrings()

  if (!changeSummary?.categoryCountMap) {
    return <></>
  }

  const { Deployment, Infrastructure, Alert } = changeSummary.categoryCountMap
  const styles = {
    font: { variation: FontVariation.SMALL },
    iconProps: { size: 12, color: Color.GREY_100 },
    color: Color.GREY_100
  }

  return (
    <Layout.Vertical spacing="small">
      <Text icon="nav-project" {...styles}>
        {createTooltipLabel(Deployment.count ?? 0, ChangeSourceTypes.Deployments, getString)}
      </Text>
      <Text
        icon="infrastructure"
        {...styles}
        iconProps={{ size: 18, color: Color.GREY_100, padding: 'none' }}
        className={css.infrastructureIconPadding}
      >
        {createTooltipLabel(Infrastructure.count ?? 0, ChangeSourceTypes.Infrastructure, getString)}
      </Text>
      <Text icon="warning-outline" {...styles}>
        {createTooltipLabel(Alert.count ?? 0, ChangeSourceTypes.Incidents, getString)}
      </Text>
    </Layout.Vertical>
  )
}
