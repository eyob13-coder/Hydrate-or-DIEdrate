import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
    <h3>Let AI assist you.</h3>
    <Agent userName = "YOU" userId = "user1" type ="generate"/>
    </>
  )
}

export default page