import { getPost } from "@/services/postServices"
import { create} from "zustand"

interface MyPostsState {
    myPosts: getPost[]
    setMyPosts: (posts: getPost[]) => void
    addMyPosts: (post: getPost) => void
    updateMyPosts: (post: getPost) => void
    deleteMyPosts: (postID: string) => void
    clearMyPosts: () => void
}

const useMyPosts = create<MyPostsState>((set) => ({
    myPosts: [],
    setMyPosts: (posts) => set({ myPosts: posts }),
    addMyPosts: (post) =>
        set((state) => ({
            myPosts: [post, ...state.myPosts],
        })),
    deleteMyPosts: (postID) =>
        set((state) => ({
            myPosts: state.myPosts.filter((post) => post.postID !== postID),
        })),
    updateMyPosts: (updatedPost) =>
        set((state) => ({
            myPosts: state.myPosts.map((post) =>
                post.postID === updatedPost.postID ? updatedPost : post
            ),
        })),
    clearMyPosts: () =>
        set({
            myPosts: [],
        }),
}))

export default useMyPosts
