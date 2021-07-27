import React, { useMemo } from 'react'
import { getTimeFilters } from '@ce/utils/perspectiveUtils'
import type { TimeRange } from '@ce/pages/overview/OverviewPage'
import {
  QlceViewAggregateOperation,
  QlceViewEntityStatsDataPoint,
  QlceViewFilterOperator,
  QlceViewFilterWrapperInput,
  QlceViewGroupByInput,
  useFetchperspectiveGridQuery,
  ViewFieldIdentifier
} from 'services/ce/services'
import { useStrings } from 'framework/strings'
import { getGMTStartDateTime } from '@ce/utils/momentUtils'
import { CE_COLOR_CONST } from '../CEChart/CEChartOptions'
import { HorizontalLayout, LEGEND_LIMIT, List, ListType, Loader, Stats } from './OverviewPageLayout'
import css from './OverviewPage.module.scss'

interface TopClusterProps {
  timeRange: TimeRange
}

const transformTopCluster = (data: QlceViewEntityStatsDataPoint[] = []): Stats[] => {
  return data.map((d, idx) => {
    return {
      label: d.name as string,
      value: d.cost,
      trend: d.costTrend,
      legendColor: CE_COLOR_CONST[idx % CE_COLOR_CONST.length]
    }
  })
}

const OverviewTopCluster = (props: TopClusterProps) => {
  const { getString } = useStrings()

  const { timeRange } = props
  const [gridResults] = useFetchperspectiveGridQuery({
    variables: {
      aggregateFunction: [{ operationType: QlceViewAggregateOperation.Sum, columnName: 'cost' }],
      filters: [
        ...getTimeFilters(getGMTStartDateTime(timeRange.from), getGMTStartDateTime(timeRange.to)),
        {
          idFilter: {
            field: { fieldId: 'cloudProvider', fieldName: 'Cloud Provider', identifier: ViewFieldIdentifier.Common },
            operator: QlceViewFilterOperator.In,
            values: ['CLUSTER']
          }
        } as QlceViewFilterWrapperInput
      ],
      isClusterOnly: false,
      limit: 10,
      offset: 0,
      groupBy: [
        {
          entityGroupBy: { fieldId: 'clusterName', fieldName: 'Cluster Name', identifier: ViewFieldIdentifier.Cluster }
        } as QlceViewGroupByInput
      ]
    }
  })

  const { data: gridData, fetching: gridFetching } = gridResults
  const data = useMemo(() => (gridData?.perspectiveGrid?.data || []) as QlceViewEntityStatsDataPoint[], [gridData])
  const chartData = useMemo(() => transformTopCluster(data), [data])
  const totalCost = useMemo(() => {
    return chartData.reduce((acc, cur) => acc + cur.value, 0)
  }, [chartData])

  if (gridFetching) {
    return <Loader />
  }

  return (
    <div className={css.topCluster}>
      <HorizontalLayout
        title={getString('ce.overview.cardtitles.topClusters')}
        chartData={chartData}
        showTrendInChart={false}
        totalCost={{
          label: getString('ce.overview.totalCost'),
          value: totalCost,
          trend: 0,
          legendColor: CE_COLOR_CONST[7]
        }}
        sideBar={<List data={chartData.slice(0, LEGEND_LIMIT)} type={ListType.KEY_VALUE} classNames={css.rowGap8} />}
      />
    </div>
  )
}

export default OverviewTopCluster
