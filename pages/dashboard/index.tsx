import styles from '../../styles/Dashboard.module.css'
import AuthCheck from '../../components/AuthCheck'
import PostFeed from '../../components/Post/PostFeed'
import { UserContext } from '../../common/context'
import { firestore, auth, serverTimestamp } from '../../common/firebase'

import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { useCollection } from 'react-firebase-hooks/firestore'
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast'

export default function OwnerPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      {/* <PostFeed posts={posts} ownerUser /> */}
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const postId = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async e => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(postId)

    // Tip: give all fields a default value here
    const data = {
      title,
      postId,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }

    await ref.set(data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/dashboard/${postId}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {postId}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}
