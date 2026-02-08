import React from 'react'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'

export default function Profile() {
  return (
     <UserLayout>
        <DashboardLayout>
    <div className='min-h-screen'>
        <div className='h-40 bg-blue-600 '>

        </div>
        <h1>Hello</h1>
    </div>
    </DashboardLayout>
    /</UserLayout>
  )
}
