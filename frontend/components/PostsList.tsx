import { useCurrentUser } from '@/hooks/useCurrentUser'
import { View, Text } from 'react-native'

const PostsList = () => {

    const{currentUser}=useCurrentUser()

  return (
    <View>
      <Text>PostsList</Text>
    </View>
  )
}

export default PostsList