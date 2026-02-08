import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'

function DiscoverPage() {
    const authState=useSelector((state)=>state.auth)
   const dispatch=useDispatch();
    useEffect(()=>{
     if(!authState.all_profiles_fetched){
      dispatch(getAllUsers())
     }
    },[])
  return (
    <UserLayout>
        <DashboardLayout>
    <div>Discover</div>

        </DashboardLayout>

    </UserLayout>
  )
}

export default DiscoverPage