import React, { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { type Post, addNewPost } from './postsSlice'
import { selectAllUsers } from '@/features/users/usersSlice'
import { selectCurrentUsername } from '../auth/authSlice'


// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    postContent: HTMLTextAreaElement
    postAuthor: HTMLSelectElement
}
interface AddPostFormElements extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>(
        'idle'
    )


    // Get the `dispatch` method from the store
    const dispatch = useAppDispatch()
    const userId = useAppSelector(selectCurrentUsername)!


    const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
        // Prevent server submission
        e.preventDefault()

        const { elements } = e.currentTarget
        const title = elements.postTitle.value
        const content = elements.postContent.value

        const form = e.currentTarget

        try {
            setAddRequestStatus('pending')
            await dispatch(addNewPost({ title, content, user: userId })).unwrap()

            form.reset()
        } catch (err) {
            console.error('Failed to save the post: ', err)
        } finally {
            setAddRequestStatus('idle')
        }
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" defaultValue="" required />
                <label htmlFor="postAuthor">Author:</label>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    defaultValue=""
                    required
                />
                <button>Save Post</button>
            </form>
        </section>
    )
}