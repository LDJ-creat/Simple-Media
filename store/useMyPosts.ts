import { getPost } from "@/services/postServices"
import { create} from "zustand"

interface MyPostsState {
    myPosts: getPost[]
    setMyPosts: (posts: getPost[]) => void
    addMyPosts: (post: getPost) => void
    updateMyPosts: (post: getPost) => void
    deleteMyPosts: (postID: number) => void
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
            myPosts: state.myPosts.filter((post) => post.ID !== postID),
        })),
    updateMyPosts: (updatedPost) =>
        set((state) => ({
            myPosts: state.myPosts.map((post) =>
                post.ID === updatedPost.ID ? updatedPost : post
            ),
        })),
    clearMyPosts: () =>
        set({
            myPosts: [],
        }),
}))

export default useMyPosts
