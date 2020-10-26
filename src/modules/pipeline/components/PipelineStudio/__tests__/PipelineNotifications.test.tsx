import React from 'react'
import { render } from '@testing-library/react'
import { PipelineNotifications } from '../PipelineNotifications/PipelineNotifications'

describe('Test PipelineNotifications', () => {
  test('should test render', () => {
    const { container } = render(<PipelineNotifications />)
    expect(container).toMatchSnapshot()
  })
})
