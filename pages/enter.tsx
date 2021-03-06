import debounce from 'lodash.debounce'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../common/context'
import {
  appleAuthProvider,
  auth,
  facebookAuthProvider,
  firestore,
  getNewUsernameSuggestionHttpCall,
  googleAuthProvider,
  serverTimestamp
} from '../common/firebase'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  FirestoreTimestamp,
  RawUser,
  Role,
  ROLE_ITEMS_LIST
} from '../typing/interfaces'
import { FlexCenterDiv, GridDiv } from '../common/uiComponents'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import { NotificationMethod } from '../typing/enums'
import CircularProgress from '@mui/material/CircularProgress'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Tooltip from '@mui/material/Tooltip'
import { COLOURS } from '../common/constants'
import { NewUsernameSuggestionRes } from '../typing/api'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default function Enter() {
  const { userAuth, user, firebaseAuthLoading, userLoading } =
    useContext(UserContext)
  const router = useRouter()

  // route user to home page if account is already registered
  useEffect(() => {
    if (userAuth && user) {
      console.log('redirecting to Home page')
      router.push('/')
    }
  }, [router, user, userAuth])

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {/**
       * Logged in with firebase auth but no username yet = no registered yet
       */}
      {firebaseAuthLoading || userLoading ? (
        <FlexCenterDiv>
          <CircularProgress />
        </FlexCenterDiv>
      ) : userAuth ? (
        !user ? (
          <UsernameForm />
        ) : (
          // REVIEW: maybe loading indicator?
          <div></div>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithPopup = async (provider: 'Google' | 'Facebook' | 'Apple') => {
    try {
      const authProvider =
        provider === 'Google'
          ? googleAuthProvider
          : provider === 'Facebook'
          ? facebookAuthProvider
          : provider === 'Apple' && appleAuthProvider

      const authRes = await auth.signInWithPopup(authProvider)
      console.log({ authRes })
      console.log(`Successfully signed in with ${provider} popup.`)
    } catch (err) {
      console.error(`Error in signInWithPopup. ${err.message}`)
      if (
        err.message.includes(
          `An account already exists with the same email address but different sign-in credentials.`
        )
      ) {
        toast.error(
          `?????? ???????????? ${
            provider === 'Google'
              ? '??????'
              : provider === 'Facebook'
              ? '????????????'
              : provider === 'Apple' && '??????'
          }??? ?????? ?????? ???????????? ?????? ????????? ?????? ????????????.`
        )
        return
      }
      if (
        !err.message.includes(
          'The popup has been closed by the user before finalizing the operation.'
        )
      ) {
        toast.error('???????????? ??????????????????. ?????? ??????????????????.')
      }
    }
  }

  useEffect(() => {
    console.log('wake up function app!')
    getNewUsernameSuggestionHttpCall()
  }, [])

  return (
    <>
      <Stack
        spacing={2}
        style={{
          alignItems: 'center'
        }}
      >
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => signInWithPopup('Google')}
        >
          <Image src={'/google.png'} width={30} height={30} />
          Google ?????????
        </FlexCenterDiv>
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => signInWithPopup('Facebook')}
        >
          <Image src={'/facebook.png'} width={30} height={30} />
          Facebook ?????????
        </FlexCenterDiv>
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => signInWithPopup('Apple')}
        >
          <Image src={'/apple.png'} width={30} height={30} />
          Apple ?????????
        </FlexCenterDiv>
      </Stack>
    </>
  )
}

function UsernameForm() {
  const router = useRouter()

  const [inkrauUsername, setInkrauUsername] = useState('')
  const [isMarketingEmail, setIsMarketingEmail] = useState(true)
  const [role, setRole] = useState<Role>(Role.WORKER)

  const [isNotValid, setIsNotValid] = useState(false)
  const [isExistInDB, setIsExistInDB] = useState(false)
  // const [loading, setLoading] = useState(false)

  const { userAuth, username } = useContext(UserContext)

  const [usernameSuggestionLoading, setUsernameSuggestionLoading] =
    useState(false)

  const onSubmit = async e => {
    e.preventDefault()

    try {
      // Create refs for both documents
      const userDoc = firestore.doc(`users/${userAuth.uid}`)
      const usernameDoc = firestore.doc(`usernames/${inkrauUsername}`)

      // Commit both docs together as a batch write
      const batch = firestore.batch()
      batch.set(userDoc, {
        uid: userAuth.uid,
        username: inkrauUsername.trim(),
        photoURL: userAuth.photoURL,
        displayName: userAuth.displayName,
        email: userAuth.email,
        providedHeartCountTotal: 0,
        receivedHeartCountTotal: 0,
        myPostCountTotal: 0,
        receivedCommentCountTotal: 0,
        providedCommentCountTotal: 0,
        receivedViewCountTotal: 0,
        providedViewCountTotal: 0,
        disabled: false,
        isAdmin: false,
        isMarketingEmail,
        notificationMethod: NotificationMethod.EMAIL,
        role,
        createdAt: serverTimestamp() as FirestoreTimestamp,
        updatedAt: null,
        disabledAt: null
      } as RawUser)
      batch.set(usernameDoc, {
        uid: userAuth.uid,
        username: inkrauUsername
      })

      await batch.commit()

      toast.success('???????????????!')

      // direct to home page
      router.push('/')
    } catch (err) {
      console.error(`Error in sign up. ${err.message}`)
      toast.error('?????? ????????? ????????? ??????????????????. ?????? ??????????????????.')
    }
  }

  const onChange = e => {
    // update setIsExistInDB false first as it will be rechecked with debounce
    setIsExistInDB(false)

    // Force form value typed in form to match correct format
    const val = e.target.value
    const lowerValue = e.target.value.toLowerCase()

    // Korean, English, number only regex
    const reg = /^[???-???|???-???|a-z|A-Z|0-9|\s]+$/

    // blank value = always valid
    if (val === '' || (reg.test(lowerValue) && lowerValue.length < 20)) {
      setIsNotValid(false)
    } else {
      setIsNotValid(true)
    }

    setInkrauUsername(val)
  }

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length > 3) {
        console.log('checkUsername...')
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        setIsExistInDB(exists)
        // setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(inkrauUsername)
  }, [checkUsername, inkrauUsername])

  const usernameHelperText = (): string => {
    console.log('username in callback ', inkrauUsername)
    if (!inkrauUsername || inkrauUsername.length < 3) {
      return '????????? ?????? ?????? ?????? ???????????????.'
    }
    if (isExistInDB) return '?????? ???????????? ????????? ?????????.'
    if (isNotValid) {
      return '??????, ??????, ?????? ???????????? ?????? 20??? ?????? ???????????????.'
    }
    return '????????? ?????? ?????? ?????? ???????????????.'
  }

  return (
    !username && (
      <section>
        <form onSubmit={onSubmit}>
          <TextField
            required={true}
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            disabled={true}
            value={userAuth.email}
            variant="standard"
            helperText="????????? ????????? ?????? ???????????? ???????????? ????????????."
          />
          <GridDiv style={{ gridTemplateColumns: '1fr 55px', gap: '5px' }}>
            <TextField
              required={true}
              label="?????????"
              size="medium"
              fullWidth
              margin="normal"
              onChange={onChange}
              value={inkrauUsername}
              error={inkrauUsername?.length > 2 && (isExistInDB || isNotValid)}
              helperText={usernameHelperText()}
              // focused
              autoFocus
            />
            <div style={{ display: 'grid', gridTemplateRows: '1fr 20px' }}>
              <div
                style={{ alignSelf: 'center' }}
                onClick={async () => {
                  setUsernameSuggestionLoading(true)
                  try {
                    const res: NewUsernameSuggestionRes =
                      await getNewUsernameSuggestionHttpCall()
                    const { newUsername, suggestion } = res.data

                    if (!suggestion) {
                      toast.error(`???????????????. ????????? ???????????? ????????????.`)
                    }
                    if (newUsername) {
                      setInkrauUsername(newUsername)
                    }
                  } catch (err) {
                    console.error(`Error in auto nickname/username generation`)
                    toast.error(
                      `???????????????. ????????? ??????????????????. ?????? ??????????????????.`
                    )
                  } finally {
                    setUsernameSuggestionLoading(false)
                  }
                }}
              >
                <Tooltip title="?????? ????????? ??????" placement="bottom" arrow>
                  <FlexCenterDiv>
                    {usernameSuggestionLoading ? (
                      <CircularProgress size={34} />
                    ) : (
                      <AutoFixHighIcon
                        fontSize="large"
                        style={{
                          padding: '2px',
                          cursor: 'pointer',
                          color: COLOURS.PRIMARY_BLUE
                        }}
                      />
                    )}
                  </FlexCenterDiv>
                </Tooltip>
                <div
                  style={{
                    fontSize: 10,
                    color: 'white',
                    backgroundColor: COLOURS.PRIMARY_BLUE,
                    padding: '1px',
                    textAlign: 'center'
                  }}
                >
                  ????????? ??????
                </div>
              </div>
              <div></div>
            </div>
          </GridDiv>
          {userAuth.displayName &&
            inkrauUsername?.length < 2 &&
            inkrauUsername !== userAuth.displayName && (
              // display it inkrauUsername is not equals to displayName
              <FlexCenterDiv>
                <Chip
                  label={
                    <span>
                      ?????? ????????? ????????? ??????:{' '}
                      <strong>{userAuth.displayName}</strong>
                    </span>
                  }
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => {
                    setInkrauUsername(userAuth.displayName)
                    setIsNotValid(false)
                  }}
                  style={{ display: 'grid', maxWidth: '350px' }}
                />
              </FlexCenterDiv>
            )}

          {/* <UsernameMessage
            username={inkrauUsername}
            isValid={isValid}
            loading={loading}
          /> */}

          <div style={{ margin: '20px 0' }}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">?????? ???????????????? *</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                label="?????? ???????????????? *"
                onChange={(event: SelectChangeEvent) => {
                  setRole(event.target.value as Role)
                }}
                required
              >
                {ROLE_ITEMS_LIST.map(roleItem => (
                  <MenuItem value={roleItem.role} key={roleItem.role}>
                    {roleItem.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div style={{ margin: '20px 0' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMarketingEmail}
                  onChange={e => {
                    setIsMarketingEmail(e.target.checked)
                  }}
                />
              }
              label={
                <span style={{ fontSize: '0.8rem' }}>
                  ??????????????? ???????????? ?????? ??????, ?????? ?????? ???????????? ??????
                  ???????????????????
                </span>
              }
            />
          </div>
          <FlexCenterDiv style={{ margin: '10px 0' }}>
            <Button
              type="submit"
              disabled={
                !(
                  inkrauUsername &&
                  inkrauUsername.length > 2 &&
                  !isExistInDB &&
                  !isNotValid
                )
              }
              variant="outlined"
            >
              ??????
            </Button>
          </FlexCenterDiv>
          {/* </button> */}

          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
        </form>
      </section>
    )
  )
}

// function UsernameMessage({ username, isValid, loading }) {
//   if (loading) {
//     return <p>Checking...</p>
//   } else if (isValid) {
//     return <p className="text-success">{username} is available!</p>
//   } else if (username && !isValid) {
//     return <p className="text-danger">That username is taken!</p>
//   } else {
//     return <p></p>
//   }
// }
