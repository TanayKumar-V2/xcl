import { useCurrentUser } from '@/hooks/useCurrentUser'
import { usePosts } from '@/hooks/usePosts'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'

const PostsList = () => {

    const { currentUser } = useCurrentUser()
    const { posts, isLoading, error, refetch, toggleLike, deletePost, checkIsLiked } = usePosts()

    if (isLoading) {
        return (
            <View className='p-8 items-center'>
                <ActivityIndicator size={"large"} color={"#1DA1F2"}>
                    <Text className='text-gray-500 mt-2'>Loading Posts...</Text>
                </ActivityIndicator>
            </View>
        )
    }

    if (error) {
        return (
            <View className="p-8 items-center">
                <Text className="text-gray-500 mb-4">Failed to load posts</Text>
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => refetch()}>
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (posts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

    return (
        <View>
            <Text>PostsList</Text>
        </View>
    )
}

export default PostsList