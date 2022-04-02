import styles from '../../styles/Post.module.css'
import PostContent from '../../components/Post/PostContent'
import {
  firestore,
  getUserWithUsername,
  postToJSON,
  tempPostToJSON
} from '../../common/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import AuthCheck from '../../components/AuthCheck'
import HeartButton from '../../components/HeartButton'
import Link from 'next/link'

export async function getStaticProps({ params }) {
  const { username, postId } = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(postId)
    post = tempPostToJSON(await postRef.get())

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 5000
  }
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get()

  const paths = snapshot.docs.map(doc => {
    const { postId, username } = doc.data()
    return {
      params: { username, postId }
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking'
  }
}

export default function Post(props) {
  const postRef = firestore.doc(props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={styles.container}>
      <section>
        {/* <PostContent post={post} /> */}
        DEPRECATED
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          {/* <HeartButton postRef={postRef} /> */}
        </AuthCheck>
      </aside>
    </main>
  )
}