import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserSync } from '@/hooks/useUsersync'
import SignOutButton from '@/components/SignOutButton'

const HomeScreen = () => {

    useUserSync()

  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>
      <SignOutButton/>
    </SafeAreaView>
  )
}

export default HomeScreen