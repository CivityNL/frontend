// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useClickOutside } from '@amsterdam/asc-ui'
import { useForm, FormProvider } from 'react-hook-form'

import useLocationReferrer from 'hooks/useLocationReferrer'
import { generateParams } from 'shared/services/api/api'
import IncidentManagementContext from 'signals/incident-management/context'
import {
  DASHBOARD_URL,
  INCIDENTS_URL,
} from 'signals/incident-management/routes'
import history from 'utils/history'

import SelectList from './SelectList'
import { FilterBar } from './styled'
import type { Option } from './types'

type Props = {
  callback?: (queryString: string) => void
}

export const Filter = ({ callback }: Props) => {
  const [filterActiveName, setFilterActiveName] = useState('')
  const { dashboardFilter, setDashboardFilter } = useContext(
    IncidentManagementContext
  )

  const location = useLocationReferrer() as { referrer: string }

  const methods = useForm<{ [key: string]: Option }>({
    defaultValues: Object.fromEntries(
      ['department', 'category', 'priority', 'punctuality', 'district'].map(
        (name) => [
          name,
          (location?.referrer === INCIDENTS_URL &&
            dashboardFilter &&
            dashboardFilter[name]) || {
            display: '',
            value: '',
          },
        ]
      )
    ),
  })

  const { getValues, watch, resetField } = methods

  const refFilterContainer = useRef<HTMLDivElement>(null)

  useClickOutside(
    refFilterContainer,
    () => filterActiveName && setFilterActiveName('')
  )

  const handleCallback = useCallback(() => {
    const selectedFilters: { [key: string]: string } = Object.fromEntries(
      Object.entries(getValues()).map(([key, value]) => {
        return [[key], value?.value]
      })
    )

    const params = generateParams(selectedFilters)

    if (callback) {
      callback(params)
    }
  }, [callback, getValues])

  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      if (type === 'change') {
        handleCallback()

        if (name === 'department') {
          resetField('category')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getValues, handleCallback, resetField, watch])

  useEffect(() => {
    handleCallback()
  }, [handleCallback, location])

  /**
   * This make sure dashboard filters value get cleared
   * when moving to another page without a backlink state property,
   * except when entering the dashboard.
   */
  useEffect(() => {
    history.listen((location: { pathname: string; state?: any }) => {
      if (location.pathname === INCIDENTS_URL && location.state?.useBacklink) {
        setDashboardFilter(getValues())
      } else if (location.pathname !== DASHBOARD_URL) {
        setDashboardFilter({})
      }
    })
  }, [getValues, setDashboardFilter])

  useEffect(() => {
    refFilterContainer.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [filterActiveName])

  return (
    <FilterBar ref={refFilterContainer}>
      <FormProvider {...methods}>
        <SelectList
          filterActiveName={filterActiveName}
          setFilterActiveName={setFilterActiveName}
        />
      </FormProvider>
    </FilterBar>
  )
}
