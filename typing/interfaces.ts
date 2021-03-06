import firebase from 'firebase/compat/app'
import { User as FirebaseUserAuth } from '@firebase/auth-types'
import {
  CalculatorLogType,
  HousePriceReportType,
  NotificationMethod,
  PropertyReportType,
  Feature
} from './enums'
import { AusKorData } from './data'

export type FirebaseDocumentSnapshot<T = firebase.firestore.DocumentData> =
  firebase.firestore.QueryDocumentSnapshot<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp

export type FirebaseDocumentRef<T = firebase.firestore.DocumentData> =
  firebase.firestore.DocumentReference<T>

export type FirebaseCollectionRef<T = firebase.firestore.DocumentData> =
  firebase.firestore.CollectionReference<T>

export enum Role {
  ADMIN = 'Admin',
  PARTNER = 'Partner',
  WORKING_HOLIDAY = 'WorkingHoliday',
  STUDENT = 'Student',
  WORKER = 'Worker',
  BUSINESS = 'Business',
  FREE_MAN = 'FreeMan',
  MYSTIC = 'Mystic',
  BASE = 'Base',
  GUEST = 'Guest'
}

export interface RoleItem {
  label: string
  role: Role
}

export const ROLE_ITEMS_LIST: RoleItem[] = [
  {
    label: '일반인',
    role: Role.BASE
  },
  {
    label: '워홀러',
    role: Role.WORKING_HOLIDAY
  },
  {
    label: '학생',
    role: Role.STUDENT
  },
  {
    label: '직장인',
    role: Role.WORKER
  },
  {
    label: '비즈니스',
    role: Role.BUSINESS
  },
  {
    label: '자유인',
    role: Role.FREE_MAN
  }
]

export const FULL_ROLE_ITEMS_LIST: RoleItem[] = [
  ...ROLE_ITEMS_LIST,
  {
    label: '파트너 에디터',
    role: Role.PARTNER
  },
  {
    label: '인크라우',
    role: Role.ADMIN
  },
  {
    label: '게스트',
    role: Role.GUEST
  }
]
export const ROLE_ITEMS_WITH_NULL_LIST: RoleItem[] = [
  {
    label: '없음',
    role: null
  },
  ...ROLE_ITEMS_LIST
]

export type RawUser = {
  uid: string
  username: string // user typed in our system
  photoURL: string
  displayName: string // user from auth provider (google)?
  email: string
  providedHeartCountTotal: number
  receivedHeartCountTotal: number
  myPostCountTotal: number
  receivedCommentCountTotal: number
  providedCommentCountTotal: number
  receivedViewCountTotal: number
  providedViewCountTotal: number
  disabled: boolean
  isAdmin: boolean
  isMarketingEmail: boolean
  notificationMethod: NotificationMethod
  role: Role
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp | null
  disabledAt: FirestoreTimestamp | null
}

export type User = Omit<
  RawUser,
  | 'createdAt'
  | 'updatedAt'
  | 'providedHeartCountTotal'
  | 'receivedHeartCountTotal'
  | 'myPostCountTotal'
  | 'receivedCommentCountTotal'
  | 'providedCommentCountTotal'
  | 'receivedViewCountTotal'
  | 'providedViewCountTotal'
> & {
  providedHeartCountTotal: number | firebase.firestore.FieldValue
  receivedHeartCountTotal: number | firebase.firestore.FieldValue
  myPostCountTotal: number | firebase.firestore.FieldValue
  receivedCommentCountTotal: number | firebase.firestore.FieldValue
  providedCommentCountTotal: number | firebase.firestore.FieldValue
  receivedViewCountTotal: number | firebase.firestore.FieldValue
  providedViewCountTotal: number | firebase.firestore.FieldValue
  createdAt: number
  updatedAt: number | null
}

export type ImageDetails = {
  url: string
  name: string
  ext: string
  size: number
}

export type Image = {
  thumbnail200: ImageDetails
  thumbnail600: ImageDetails
  original: ImageDetails
}

export type RawPost = {
  postId: string // email(before @) + unix timestamp = documentId
  uid: string // userId
  username: string
  coverUsername: string // only for admin purpose
  coverRole: Role // only for admin purpose
  title: string
  deleted: boolean
  heartCount: number // need another approach?
  commentCount: number
  //
  viewCount: number
  //
  content: string
  htmlContent: string
  //
  isHtmlContent: boolean
  //
  images: Image[]
  excerpt: string
  //
  categories: CategoryOption[]
  //
  notificationIncludedUids: string[]
  //
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedBy: string | null
  updatedAt: FirestoreTimestamp | null
  //
  createdByRole: Role
  //
  isInkrauOfficial: boolean
  isTest: boolean
}

export type Post = Omit<RawPost, 'createdAt' | 'updatedAt' | 'commentCount'> & {
  commentCount: number | firebase.firestore.FieldValue
  createdAt: number
  updatedAt: number | null
}

export type PostWrite = Pick<
  Post,
  | 'title'
  | 'htmlContent'
  | 'isHtmlContent'
  | 'content'
  | 'images'
  | 'categories'
  | 'isTest'
  | 'coverUsername'
  | 'coverRole'
  | 'isInkrauOfficial'
>

export type ImgType = 'thumbnail200' | 'thumbnail600' | 'original'

export type RawComment = {
  commentId: string
  username: string
  coverUsername: string // only for admin purpose
  coverRole: Role // only for admin purpose
  guestNickname: string
  // guestPassCode: string // currently disabled
  level: number
  parentCommentId: string | null
  content: string
  deleted: boolean
  adminDeleted: boolean
  adminDeletedReason: string | null
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedBy: string
  updatedAt: FirestoreTimestamp
  //
  createdByRole: Role
}

export type Comment = Omit<RawComment, 'createdAt' | 'updatedAt'> & {
  createdAt: number
  updatedAt: number | null
}

export interface CommentWithChildren extends Comment {
  childComments?: CommentWithChildren[]
}

export interface UserDataContext {
  userAuth: FirebaseUserAuth
  user: User
  username: string
  isAdmin: boolean
  firebaseAuthLoading: boolean
  userLoading: boolean
}

export interface RawHeart {
  heartId: string
  postId: string
  uid: string
  value: number
  createdAt: FirestoreTimestamp
}

export interface RawCategory {
  categoryId: string
  name: string
  postCount: number
  sort: number
  adminOnly: boolean
  disabled: boolean
  createdAt: FirestoreTimestamp
  updatedBy: string | null
  updatedAt: FirestoreTimestamp | null
}

export type Category = Omit<
  RawCategory,
  'postCount' | 'createdAt' | 'updatedAt'
> & {
  postCount: number | firebase.firestore.FieldValue
  createdAt: number
  updatedBy: string | null
  updatedAt: number | null
}

export type CategoryOption = Pick<RawCategory, 'categoryId' | 'name'>

export interface RawTopCategory {
  categoryTopId: string
  name: string
  sort: number
  disabled: boolean
  createdAt: FirestoreTimestamp
}

export type TopCategory = Omit<RawTopCategory, 'createdAt'> & {
  createdAt: number
}

export type ExtendedTopCategory = TopCategory & {
  selected: boolean
}

export type PostType = 'inkrau' | 'community'

export interface RawCalculatorLog {
  calculatorLogId: string
  type: CalculatorLogType
  details: string
  createdAt: FirestoreTimestamp
  createdBy: string
}

export type CalculatorLog = Omit<RawCalculatorLog, 'createdAt'> & {
  createdAt: number
}

export interface RawFeatureView {
  featureViewId: string
  feature: Feature
  viewValue: number
  createdAt: FirestoreTimestamp
  // createdBy: string
}

export interface RawFeatureDetail {
  featureId: Feature
  viewCountTotal: number
  submitCountTotal?: number
  updatedAt: FirestoreTimestamp
}

export type FeatureDetail = Omit<RawFeatureDetail, 'updatedAt'> & {
  updatedAt: number | null
}
export interface RawPropertyReportLabel {
  propertyReportLabelId: string
  propertyReportType: PropertyReportType
  label: string
  korLabel: string
  createdAt: FirestoreTimestamp
}

export type PropertyReportLabel = Omit<RawPropertyReportLabel, 'createdAt'> & {
  createdAt: number | null
}

export interface RawPropertyReport {
  propertyReportType: PropertyReportType
  propertyReportId: string
  propertyReportLabelId: string
  type: HousePriceReportType
  embedHtml: string
  createdAt: FirestoreTimestamp
}

export type PropertyReport = Omit<RawPropertyReport, 'createdAt'> & {
  createdAt: number | null
}

export interface AusKorDataset {
  createdAt: number // unix time
  ausKorDataList: AusKorData[]
}
