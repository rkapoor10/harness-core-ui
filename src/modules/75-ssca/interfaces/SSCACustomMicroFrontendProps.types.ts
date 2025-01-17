import type { Duration } from '@common/components'
import type { useQueryParams, useUpdateQueryParams } from '@common/hooks'
import { useQueryParamsOptions } from '@common/hooks/useQueryParams'

export interface SSCACustomMicroFrontendProps {
  customHooks: {
    useQueryParams: typeof useQueryParams
    useUpdateQueryParams: typeof useUpdateQueryParams
    useQueryParamsOptions: typeof useQueryParamsOptions
  }
  customComponents: {
    Duration: typeof Duration
  }
}
