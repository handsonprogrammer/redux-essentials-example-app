import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/app/hooks'
// omit imports
import { postUpdated, selectPostById } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface EditPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    postContent: HTMLTextAreaElement
    postAuthor: HTMLSelectElement
}
interface EditPostFormElements extends HTMLFormElement {
    readonly elements: EditPostFormFields
}


export const EditPostForm = () => {
  const { postId } = useParams()

  const post = useAppSelector(state => selectPostById(state, postId!))
  const users = useAppSelector(selectAllUsers);

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = (e: React.FormEvent<EditPostFormElements>) => {
    // Prevent server submission
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value
    const user = elements.postAuthor.value

    if (title && content && user) {
      dispatch(postUpdated({ id: post.id, title, content, user }))
      navigate(`/posts/${postId}`)
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          defaultValue={post.title}
          required
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue={post.content}
          required
        />
        <select id="postAuthor" name="postAuthor" required defaultValue={post.user}>
            <option value=""></option>
            {usersOptions}
        </select>
        <button>Save Post</button>
      </form>
    </section>
  )
}