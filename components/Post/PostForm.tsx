import { FC, useContext, useState, useEffect, useMemo } from 'react'
import {
  Category,
  FirestoreTimestamp,
  Post,
  PostWrite,
  RawPost,
  Role,
  ROLE_ITEMS_WITH_NULL_LIST
} from '../../typing/interfaces'
import { UserContext } from '../../common/context'
import {
  firestore,
  auth,
  serverTimestamp,
  increment
} from '../../common/firebase'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { generateExcerpt, generateHtmlExcerpt } from '../../common/functions'
import toast from 'react-hot-toast'
import TextField from '@mui/material/TextField'
import ImageUploader from '../ImageUploader'
import { FlexCenterDiv } from '../../common/uiComponents'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import {
  batchUpdateCategoryCounts,
  batchUpdateUsers
} from '../../common/update'
import { generatePostDocumentId } from '../../common/idHelper'
import Stack from '@mui/material/Stack'
import {
  HorizontalScrollContainer,
  HorizontalScrollItem
} from 'react-simple-horizontal-scroller'
import Box from '@mui/material/Box'
import { getAllCategories } from '../../common/get'
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton
} from '@mui/material'
import { NotificationMethod } from '../../typing/enums'
import Link from 'next/link'
import { COLOURS } from '../../common/constants'
import QuillEditor from './QuillEditor'
import Switch from '@mui/material/Switch'

type ExtendedCategory = Category & {
  selected: boolean
}

interface Props {
  editPost?: Post
}
const PostForm: FC<Props> = ({ editPost }) => {
  const router = useRouter()
  const { isAdmin, user, username } = useContext(UserContext)
  const isEditMode = !!editPost
  const [categories, setCategories] = useState<ExtendedCategory[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [isHtmlContent, setIsHtmlContent] = useState(false)

  const [coverRole, setCoverRole] = useState<Role>(null)

  useEffect(() => {
    if (editPost) {
      console.log('updating htmlContent, isHtmlContent values')
      setHtmlContent(editPost.htmlContent)
      setIsHtmlContent(editPost.isHtmlContent)
      setCoverRole(editPost.coverRole)
    }
  }, [editPost])

  // getAllCategories + pre select categories from editPost
  useEffect(() => {
    setCategoryLoading(true)
    getAllCategories()
      .then(categories => {
        console.log('getAllCategories...')
        // EDIT
        if (isEditMode) {
          // selected true from categories in edit post
          setCategories(
            categories.map(c => {
              const match = editPost.categories.find(
                editCat => editCat.categoryId === c.categoryId
              )
              return { ...c, selected: match ? true : false }
            })
          )
        }
        // CREATE
        else {
          setCategories(categories.map(c => ({ ...c, selected: false })))
        }
        setCategoryLoading(false)
      })
      .catch(err => {
        console.error(`Error in getAllCategories. ERROR: ${err}`)
        setCategoryLoading(false)
      })
  }, [editPost, isEditMode])

  const noCategorySelect = useMemo(
    () => categories.every(c => !c.selected),
    [categories]
  )

  const {
    handleSubmit,
    control,
    setValue,
    watch
    // reset, watch
  } = useForm<PostWrite>({
    defaultValues: isEditMode
      ? // EDIT
        {
          title: editPost.title,
          images: editPost.images,
          categories: editPost.categories,
          content: editPost.content,
          // handling htmlContent outside
          // htmlContent: editPost.htmlContent,
          // isHtmlContent: editPost.isHtmlContent,
          isTest: editPost.isTest,
          coverRole: editPost.coverRole,
          coverUsername: editPost.coverUsername,
          isInkrauOfficial: editPost.isInkrauOfficial
        }
      : // CREATE
        {
          title: '',
          images: [],
          categories: [],
          content: '',
          // handling htmlContent outside
          // htmlContent: '',
          // isHtmlContent: false,
          isTest: false,
          isInkrauOfficial: false
        }
  })

  const onSubmit = async (data: PostWrite) => {
    try {
      setSubmitLoading(true)
      const selectedCategories = categories.filter(e => e.selected)

      // EDIT
      if (isEditMode) {
        const batch = firestore.batch()

        const postId = editPost.postId

        const postRef = firestore.collection('posts').doc(postId)

        batch.update(postRef, {
          ...data,
          coverRole,
          categories: selectedCategories.map(category => ({
            categoryId: category.categoryId,
            name: category.name
          })),
          htmlContent,
          isHtmlContent: isHtmlContent,
          excerpt: isHtmlContent
            ? generateHtmlExcerpt(htmlContent, 150)
            : generateExcerpt(data.content, 150),
          updatedBy: user.uid,
          updatedAt: serverTimestamp()
        })

        // increase counts for newly selected categories
        const newlySelectedCategories = categories.filter(
          c =>
            c.selected &&
            !editPost.categories.find(cat => cat.categoryId === c.categoryId)
        )
        if (newlySelectedCategories.length) {
          batchUpdateCategoryCounts(batch, newlySelectedCategories, user.uid, {
            postCount: increment(1)
          })
        }

        // decrease counts for newly unselected categories
        const newlyUnselectedCategories = categories.filter(
          c =>
            !c.selected &&
            editPost.categories.find(cat => cat.categoryId === c.categoryId)
        )
        if (newlyUnselectedCategories.length) {
          batchUpdateCategoryCounts(
            batch,
            newlyUnselectedCategories,
            user.uid,
            {
              postCount: increment(-1)
            }
          )
        }

        await batch.commit()

        toast.success('게시물 업데이트가 완료 되었습니다.')
        setSubmitLoading(false)
        router.push(`/post/${postId}`)
      }
      // CREATE
      if (!isEditMode) {
        const postId = generatePostDocumentId(user.email)

        const postRef = firestore.collection('posts').doc(postId)

        const post: RawPost = {
          postId,
          uid: auth.currentUser.uid,
          coverRole: coverRole,
          coverUsername: data.coverUsername || '',
          username,
          title: data.title,
          content: data.content,
          htmlContent,
          isHtmlContent: isHtmlContent,
          excerpt: isHtmlContent
            ? generateHtmlExcerpt(htmlContent, 150)
            : generateExcerpt(data.content, 150),
          deleted: false,
          heartCount: 0,
          viewCount: 0,
          commentCount: 0,
          images: data.images,
          categories: selectedCategories.map(category => ({
            categoryId: category.categoryId,
            name: category.name
          })),
          notificationIncludedUids: [],
          createdBy: user.uid,
          createdAt: serverTimestamp() as FirestoreTimestamp,
          updatedBy: null,
          updatedAt: null,
          createdByRole: user.role,
          isTest: data.isTest,
          isInkrauOfficial: data.isInkrauOfficial
        }

        const batch = firestore.batch()
        batch.set(postRef, post)

        batchUpdateUsers(batch, user.uid, {
          myPostCountTotal: increment(1)
        })

        // add category counts
        if (selectedCategories.length) {
          batchUpdateCategoryCounts(batch, selectedCategories, user.uid, {
            postCount: increment(1)
          })
        }

        await batch.commit()

        toast.success('게시물이 성공적으로 등록 되었습니다.')
        setSubmitLoading(false)
        router.push('/')
      }
    } catch (err) {
      console.error(`Error in PostForm create/edit. ${err.message}`)
      toast.error('에러가 발생했습니다. 다시 시도해주세요.')
      setSubmitLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 2, mt: 1 }}>
      {/**
       * DEV ONLY - easy category creation
       */}
      {/* <button
        onClick={async () => {
          const tempObj: RawCategory = {
            categoryId: 'category-wa',
            name: 'WA',
            postCount: 0,
            sort: 1300,
            adminOnly: false,
            disabled: false,
            createdAt: serverTimestamp() as FirestoreTimestamp
          }
          await firestore
            .collection('categories')
            .doc(tempObj.categoryId)
            .set(tempObj)
          console.log('done')
        }}
      >
        CREATE (DEV ONLY)
      </button> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: '10px', width: '100%' }}
      >
        {/**
         * REVIEW: react-hook-form & mui checkbox doesn't work with default value
         */}
        {isAdmin && (
          <>
            <FormControlLabel
              label={`테스트 게시물 (관리자 전용) - ${watch().isTest}`}
              control={
                <Controller
                  name="isTest"
                  control={control}
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
            />
            <FormControlLabel
              label={`인크라우 공식 컨텐츠 (관리자 전용) - ${
                watch().isInkrauOfficial
              }`}
              control={
                <Controller
                  name="isInkrauOfficial"
                  control={control}
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
            />
            {/* <FormControlLabel
              label={`커버 닉네임 (관리자 전용)`}
              control={
                <Controller
                  name="coverUsername"
                  control={control}
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
            /> */}
            <Controller
              name="coverUsername"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  label="커버 닉네임(관리자 전용)"
                  variant="outlined"
                  {...field}
                  fullWidth
                  helperText="기존 유저들의 닉네임을 피해서 사용하세요. 빈칸으로 두면 원래대로 현재 유저의 닉네임이 사용 됩니다."
                />
              )}
            />
            <div style={{ marginTop: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">
                  커버 나는 누구? *
                </InputLabel>
                <Select
                  labelId="cover-role-select-label"
                  id="cover-role-select"
                  value={coverRole}
                  label="커버 나는 누구? *"
                  onChange={(event: SelectChangeEvent) => {
                    setCoverRole(event.target.value as Role)
                  }}
                >
                  {ROLE_ITEMS_WITH_NULL_LIST.map(roleItem => (
                    <MenuItem
                      value={roleItem.role}
                      key={`${roleItem.role}${roleItem.label}`}
                    >
                      {roleItem.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={isHtmlContent}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setIsHtmlContent(event.target.checked)
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="텍스트 에디터 (관리자 전용)"
            />
          </>
        )}
        <Stack spacing={2} style={{ marginTop: '5px' }} sx={{ width: '100%' }}>
          {categoryLoading ? (
            <Skeleton width="100%" height={32} />
          ) : (
            <Box
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '60px 1fr'
              }}
            >
              <Chip
                label={'없음'}
                color="info"
                variant={noCategorySelect ? 'filled' : 'outlined'}
                onClick={() =>
                  // all selected false
                  setCategories(prev =>
                    prev.map(cat => ({ ...cat, selected: false }))
                  )
                }
              />

              {/* <FlexCenterDiv></FlexCenterDiv> */}
              <HorizontalScrollContainer>
                {categories.map(category => {
                  return (
                    <HorizontalScrollItem
                      id={category.categoryId}
                      key={category.categoryId}
                      // toggle selected
                      onClick={() => {
                        const selectedList = categories.filter(
                          cat => cat.selected
                        )
                        // no more than 3 categories
                        if (selectedList.length > 2) {
                          const matched = selectedList.find(
                            c => c.categoryId === category.categoryId
                          )
                          // enable toggle only when making true -> false
                          if (!matched || (matched && !matched.selected)) {
                            return
                          }
                        }
                        return setCategories(prev =>
                          prev.map(cat =>
                            cat.categoryId === category.categoryId
                              ? { ...cat, selected: !cat.selected }
                              : cat
                          )
                        )
                      }}
                    >
                      <Chip
                        label={category.name}
                        style={{ margin: '0 5px', cursor: 'pointer' }}
                        variant={category.selected ? 'filled' : 'outlined'}
                        color="primary"
                      />
                    </HorizontalScrollItem>
                  )
                })}
              </HorizontalScrollContainer>
            </Box>
          )}
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField label="제목" variant="outlined" {...field} fullWidth />
            )}
          />
          {isHtmlContent ? (
            <div style={{ height: '500px' }}>
              <QuillEditor content={htmlContent} setContent={setHtmlContent} />
            </div>
          ) : (
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  label="내용"
                  variant="outlined"
                  {...field}
                  multiline
                  rows={15}
                  fullWidth
                />
              )}
            />
          )}
        </Stack>
        <ImageUploader
          setValue={setValue}
          setImageLoading={setImageLoading}
          editThumbnailImgUrl={
            // REVIEW: this only supports single thumbnail url
            isEditMode
              ? isHtmlContent //html content has small thumbnail only
                ? editPost?.images?.[0]?.thumbnail200?.url || ''
                : editPost?.images?.[0]?.thumbnail600?.url || ''
              : null
          }
          thumbnailOnly={isHtmlContent}
        />
        <FlexCenterDiv>
          <Button
            variant="outlined"
            type="submit"
            disabled={
              imageLoading ||
              !(watch().content || htmlContent) ||
              !watch().title ||
              submitLoading
            }
          >
            완료
          </Button>
        </FlexCenterDiv>
        <FlexCenterDiv>
          <div style={{ fontSize: '11px' }}>
            {user?.notificationMethod === NotificationMethod.EMAIL ? (
              <>
                <span style={{ color: COLOURS.PRIMARY_SPACE_GREY }}>
                  새로운 댓글이 달리면 이메일로 알려드립니다.{' '}
                </span>
                <Link href={`/${user.username}`}>
                  <a target="_blank" style={{ color: COLOURS.PRIMARY_BLUE }}>
                    설정 바꾸기
                  </a>
                </Link>
              </>
            ) : user?.notificationMethod === NotificationMethod.NONE ? (
              <>
                <span style={{ color: COLOURS.PRIMARY_SPACE_GREY }}>
                  새로운 댓글 알림 설정이 꺼져 있습니다.{' '}
                </span>
                <Link href={`/${user.username}`}>
                  <a target="_blank" style={{ color: COLOURS.PRIMARY_BLUE }}>
                    설정 바꾸기
                  </a>
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
        </FlexCenterDiv>
      </form>
    </Paper>
  )
}

export default PostForm
