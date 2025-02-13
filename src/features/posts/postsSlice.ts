import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type { RootState } from '@/app/store'
import { sub } from 'date-fns' 
import { userLoggedOut } from '@/features/auth/authSlice'

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string
  user:string
  date:string
  reactions: Reactions
}

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content' | 'user'>


// Create an initial state value for the reducer, with that type
const initialState: Post[] = [
  { id: '1', title: 'First Post!', content: 'Hello!', user: '0', date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: initialReactions },
  { id: '2', title: 'Second Post', content: 'More text', user: '1', date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: initialReactions  }
]

// Create the slice and pass in the initial state
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.push(action.payload)
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: { 
            id: nanoid(),
            date: new Date().toISOString(), 
            title, 
            content , 
            user: userId ,
            reactions: initialReactions
          }
        }
      }
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content, user } = action.payload
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
        existingPost.user = user
        existingPost.date = new Date().toISOString()
      }
    },
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers: (builder) => {
    // Pass the action creator to `builder.addCase()`
    builder.addCase(userLoggedOut, (state) => {
      // Clear out the list of posts whenever the user logs out
      return []
    })
  },
  /* selectors: {
    // Note that these selectors are given just the `PostsState`
    // as an argument, not the entire `RootState`
    selectAllPosts: postsState => postsState,
    selectPostById: (postsState, postId: string) => {
      return postsState.find(post => post.id === postId)
    }
  } */
})
// Export the auto-generated action creator with the same name
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
// Export the generated reducer function
export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts

export const selectPostById = (state: RootState, postId: string) => state.posts.find(post => post.id === postId)