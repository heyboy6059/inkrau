import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/analytics'
import 'firebase/compat/functions'

// import { getAnalytics } from 'firebase/analytics'
import {
  FirebaseDocumentSnapshot,
  Post,
  RawComment,
  Comment,
  RawPost,
  RawUser,
  User,
  RawCategory,
  Category,
  RawFeatureDetail,
  PropertyReportLabel,
  RawPropertyReportLabel,
  RawPropertyReport,
  PropertyReport,
  RawTopCategory,
  TopCategory
} from '../typing/interfaces'
import { QueryDocumentSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDZM4GcEwLya_cjnIHbn2qJth7gnw-U0QU',
  authDomain: 'austory-danpark.firebaseapp.com',
  projectId: 'austory-danpark',
  storageBucket: 'austory-danpark.appspot.com',
  messagingSenderId: '937500945011',
  appId: '1:937500945011:web:f83bf20ccf46139ebfd806',
  measurementId: 'G-FXZVL0QDVQ'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

if (typeof window !== 'undefined') {
  firebase.analytics()
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

export const fromMillis = firebase.firestore.Timestamp.fromMillis

// http functions
export const getNewUsernameSuggestionHttpCall = functions.httpsCallable(
  'getNewUsernameSuggestion'
)

// auth providers
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()
export const appleAuthProvider = new firebase.auth.OAuthProvider('apple.com')

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export const increment = firebase.firestore.FieldValue.increment

/**
 * Gets a users/{uid} document with username
 * @param username
 * @returns
 */
export const getUserWithUsername = async (
  username: string
): Promise<FirebaseDocumentSnapshot> => {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

/**
 * Converts a firestore document to JSON
 * @param doc
 * @returns
 */
export const postToJSON = (doc: FirebaseDocumentSnapshot<RawPost>): Post => {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0
  }
}

/**
 * Converts a firestore document to JSON
 * @param doc
 * @returns
 */
export const postQueryDocToJSON = (
  doc: QueryDocumentSnapshot<RawPost>
): Post => {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0
  }
}

/**
 * Converts a firestore document to JSON
 * @param doc
 * @returns
 */
export const tempPostToJSON = doc => {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0
  }
}

export const userToJSON = (
  user: FirebaseDocumentSnapshot<RawUser>
): User | null => {
  const userData = user.data()
  if (!userData) return null
  return {
    ...userData,
    createdAt: userData?.createdAt?.toMillis() || 0,
    updatedAt: userData?.updatedAt?.toMillis() || 0
  }
}

export const commentToJSON = (
  comment: FirebaseDocumentSnapshot<RawComment>
): Comment => {
  const commentData = comment.data()
  return {
    ...commentData,
    createdAt: commentData?.createdAt?.toMillis() || 0,
    updatedAt: commentData?.updatedAt?.toMillis() || 0
  }
}

export const categoryToJSON = (
  category: FirebaseDocumentSnapshot<RawCategory>
): Category => {
  const categoryData = category.data()
  return {
    ...categoryData,
    createdAt: categoryData?.createdAt?.toMillis() || 0,
    updatedAt: categoryData?.updatedAt?.toMillis() || 0
  }
}

export const topCategoryToJSON = (
  category: FirebaseDocumentSnapshot<RawTopCategory>
): TopCategory => {
  const categoryData = category.data()
  return {
    ...categoryData,
    createdAt: categoryData?.createdAt?.toMillis() || 0
  }
}
// TODO: generalize all dataToJSON functions

export const featureDetailToJSON = (
  featureDetail: FirebaseDocumentSnapshot<RawFeatureDetail>
) => {
  const featureDetailData = featureDetail.data()
  // console.log({ featureDetailData })
  return {
    ...featureDetailData,
    updatedAt: featureDetailData?.updatedAt?.toMillis() || 0
  }
}

export const propertyReportLabelToJSON = (
  propertyReportLabel: FirebaseDocumentSnapshot<RawPropertyReportLabel>
): PropertyReportLabel => {
  const propertyReportData = propertyReportLabel.data()
  return {
    ...propertyReportData,
    createdAt: propertyReportData?.createdAt?.toMillis() || 0
  }
}

export const propertyReportToJSON = (
  propertyReport: FirebaseDocumentSnapshot<RawPropertyReport>
): PropertyReport => {
  const propertyReportData = propertyReport.data()
  return {
    ...propertyReportData,
    createdAt: propertyReportData?.createdAt?.toMillis() || 0
  }
}
