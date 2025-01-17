/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import * as servicediscovery from 'services/servicediscovery'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { TestWrapper } from '@common/utils/testUtils'
import { useGetK8SCustomService, useGetServiceFromK8SCustomService } from 'services/servicediscovery'
import ServiceDetails from '../ServiceDetails'
import { mockGetCustomService, mockServiceDetails } from './mockData'

const mockServiceDetailsProp = {
  serviceId: 'testServiceId',
  infraId: 'testInfraId',
  serviceName: 'k8s-service',
  closeModal: jest.fn()
}

const fetchServiceFromK8SCustomService = jest.fn(() => Promise.resolve(mockServiceDetails))
const fetchK8SCustomService = jest.fn(() => Promise.resolve(mockGetCustomService))

jest.mock('services/servicediscovery', () => ({
  useGetServiceFromK8SCustomService: jest.fn().mockImplementation(() => {
    return { data: mockServiceDetails, refetch: fetchServiceFromK8SCustomService, error: null, loading: false }
  }),
  useGetK8SCustomService: jest.fn().mockImplementation(() => {
    return { data: mockGetCustomService, refetch: fetchK8SCustomService, error: null, loading: false }
  })
}))

const PATH = routes.toDiscovery({ ...accountPathProps, ...projectPathProps })
const PATH_PARAMS = {
  accountId: 'accountId',
  orgIdentifier: 'default',
  projectIdentifier: 'Discovery_Test',
  module: 'chaos'
}

describe('Service Details component tests', () => {
  beforeEach(() => jest.clearAllMocks())

  test('should match snapshot with mock data', async () => {
    const { container, getByTestId } = render(
      <TestWrapper path={PATH} pathParams={PATH_PARAMS}>
        <ServiceDetails {...mockServiceDetailsProp} />
      </TestWrapper>
    )
    expect(useGetServiceFromK8SCustomService).toBeCalled()
    expect(useGetK8SCustomService).toBeCalled()

    expect(container).toMatchSnapshot()

    //close the modal
    act(() => {
      fireEvent.click(getByTestId('closeButton'))
    })
  })

  test('should match snapshot with empty data', async () => {
    jest.spyOn(servicediscovery, 'useGetServiceFromK8SCustomService').mockImplementation((): any => {
      return {
        data: null,
        loading: false,
        error: {
          message: 'some error'
        }
      }
    })
    jest.spyOn(servicediscovery, 'useGetK8SCustomService').mockImplementation((): any => {
      return {
        data: null,
        loading: false,
        error: {
          message: 'some error'
        }
      }
    })

    const { container } = render(
      <TestWrapper path={PATH} pathParams={PATH_PARAMS}>
        <ServiceDetails {...mockServiceDetailsProp} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
