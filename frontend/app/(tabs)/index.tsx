import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserSync } from '@/hooks/useUsersync'
import SignOutButton from '@/components/SignOutButton'
import { Ionicons } from '@expo/vector-icons'
import PostComposer from '@/components/PostComposer'

const HomeScreen = () => {

    useUserSync()

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-500'>
        <Ionicons name='logo-twitter' size={24} color={"#1DA1F2"} />
        <Text className='text-xl font-bold text-gray-900'>Home</Text>
        <SignOutButton/>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1' contentContainerStyle={{paddingBottom:80}}>
        <PostComposer/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen