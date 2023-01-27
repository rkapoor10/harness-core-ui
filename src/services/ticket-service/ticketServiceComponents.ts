/**
 * Generated by @openapi-codegen
 *
 * @version 0.1.0-beta
 */
import * as reactQuery from '@tanstack/react-query'
import { useTicketServiceContext, TicketServiceContext } from './ticketServiceContext'
import type * as Fetcher from './ticketServiceFetcher'
import { ticketServiceFetch } from './ticketServiceFetcher'
import type * as Schemas from './ticketServiceSchemas'

export type SettingsSaveSettingQueryParams = {
  /*
   * Harness Account ID
   *
   * @example abcdef1234567890ghijkl
   * @pattern ^[a-zA-Z0-9_-]{22}$
   */
  accountId: string
  /*
   * Harness Organization ID
   *
   * @example example_org
   * @pattern ^[A-Za-z_][A-Za-z0-9_]*$
   * @maxLength 128
   */
  orgId?: string
  /*
   * Harness Project ID
   *
   * @example example_project
   * @pattern ^[A-Za-z_][A-Za-z0-9_]*$
   * @maxLength 128
   */
  projectId?: string
}

export type SettingsSaveSettingError = Fetcher.ErrorWrapper<
  | {
      status: 400
      payload: Schemas.BadRequest
    }
  | {
      status: 401
      payload: Schemas.BadRequest
    }
  | {
      status: 403
      payload: Schemas.BadRequest
    }
  | {
      status: 500
      payload: Schemas.BadRequest
    }
>

export type SettingsSaveSettingVariables = {
  body: Schemas.SaveSettingRequestBody
  queryParams: SettingsSaveSettingQueryParams
} & TicketServiceContext['fetcherOptions']

/**
 * Create or update a Ticket Service Setting
 */
export const fetchSettingsSaveSetting = (variables: SettingsSaveSettingVariables) =>
  ticketServiceFetch<
    undefined,
    SettingsSaveSettingError,
    Schemas.SaveSettingRequestBody,
    {},
    SettingsSaveSettingQueryParams,
    {}
  >({ url: '/api/settings', method: 'put', ...variables })

/**
 * Create or update a Ticket Service Setting
 */
export const useSettingsSaveSetting = (
  options?: Omit<
    reactQuery.UseMutationOptions<undefined, SettingsSaveSettingError, SettingsSaveSettingVariables>,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useTicketServiceContext()
  return reactQuery.useMutation<undefined, SettingsSaveSettingError, SettingsSaveSettingVariables>(
    (variables: SettingsSaveSettingVariables) => fetchSettingsSaveSetting({ ...fetcherOptions, ...variables }),
    options
  )
}

export type SystemHealthError = Fetcher.ErrorWrapper<{
  status: 500
  payload: Schemas.BadRequest
}>

export type SystemHealthVariables = TicketServiceContext['fetcherOptions']

/**
 * Check service health
 */
export const fetchSystemHealth = (variables: SystemHealthVariables) =>
  ticketServiceFetch<undefined, SystemHealthError, undefined, {}, {}, {}>({
    url: '/api/system/health',
    method: 'get',
    ...variables
  })

/**
 * Check service health
 */
export const useSystemHealth = <TData>(
  variables: SystemHealthVariables,
  options?: Omit<reactQuery.UseQueryOptions<undefined, SystemHealthError, TData>, 'queryKey' | 'queryFn'>
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useTicketServiceContext(options)
  return reactQuery.useQuery<undefined, SystemHealthError, TData>(
    queryKeyFn({ path: '/api/system/health', operationId: 'systemHealth', variables }),
    () => fetchSystemHealth({ ...fetcherOptions, ...variables }),
    {
      ...options,
      ...queryOptions
    }
  )
}

export type SystemVersionError = Fetcher.ErrorWrapper<undefined>

export type SystemVersionVariables = TicketServiceContext['fetcherOptions']

/**
 * Get service version
 */
export const fetchSystemVersion = (variables: SystemVersionVariables) =>
  ticketServiceFetch<Schemas.ServiceVersion, SystemVersionError, undefined, {}, {}, {}>({
    url: '/api/system/version',
    method: 'get',
    ...variables
  })

/**
 * Get service version
 */
export const useSystemVersion = <TData>(
  variables: SystemVersionVariables,
  options?: Omit<reactQuery.UseQueryOptions<Schemas.ServiceVersion, SystemVersionError, TData>, 'queryKey' | 'queryFn'>
) => {
  const { fetcherOptions, queryOptions, queryKeyFn } = useTicketServiceContext(options)
  return reactQuery.useQuery<Schemas.ServiceVersion, SystemVersionError, TData>(
    queryKeyFn({ path: '/api/system/version', operationId: 'systemVersion', variables }),
    () => fetchSystemVersion({ ...fetcherOptions, ...variables }),
    {
      ...options,
      ...queryOptions
    }
  )
}

export type TicketsCreateTicketQueryParams = {
  /*
   * Harness Account ID
   *
   * @example abcdef1234567890ghijkl
   * @pattern ^[a-zA-Z0-9_-]{22}$
   */
  accountId: string
  /*
   * Harness Organization ID
   *
   * @example example_org
   * @pattern ^[A-Za-z_][A-Za-z0-9_]*$
   * @maxLength 128
   */
  orgId?: string
  /*
   * Harness Project ID
   *
   * @example example_project
   * @pattern ^[A-Za-z_][A-Za-z0-9_]*$
   * @maxLength 128
   */
  projectId?: string
}

export type TicketsCreateTicketError = Fetcher.ErrorWrapper<
  | {
      status: 400
      payload: Schemas.BadRequest
    }
  | {
      status: 401
      payload: Schemas.BadRequest
    }
  | {
      status: 403
      payload: Schemas.BadRequest
    }
  | {
      status: 500
      payload: Schemas.BadRequest
    }
>

export type TicketsCreateTicketVariables = {
  body: Schemas.CreateTicketRequestBody
  queryParams: TicketsCreateTicketQueryParams
} & TicketServiceContext['fetcherOptions']

/**
 * Create a new External Ticket
 */
export const fetchTicketsCreateTicket = (variables: TicketsCreateTicketVariables) =>
  ticketServiceFetch<
    Schemas.TicketsCreateTicketResponseBody,
    TicketsCreateTicketError,
    Schemas.CreateTicketRequestBody,
    {},
    TicketsCreateTicketQueryParams,
    {}
  >({ url: '/api/tickets', method: 'post', ...variables })

/**
 * Create a new External Ticket
 */
export const useTicketsCreateTicket = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      Schemas.TicketsCreateTicketResponseBody,
      TicketsCreateTicketError,
      TicketsCreateTicketVariables
    >,
    'mutationFn'
  >
) => {
  const { fetcherOptions } = useTicketServiceContext()
  return reactQuery.useMutation<
    Schemas.TicketsCreateTicketResponseBody,
    TicketsCreateTicketError,
    TicketsCreateTicketVariables
  >((variables: TicketsCreateTicketVariables) => fetchTicketsCreateTicket({ ...fetcherOptions, ...variables }), options)
}

export type QueryOperation =
  | {
      path: '/api/system/health'
      operationId: 'systemHealth'
      variables: SystemHealthVariables
    }
  | {
      path: '/api/system/version'
      operationId: 'systemVersion'
      variables: SystemVersionVariables
    }