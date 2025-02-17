import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, ScrollView, View, TextInput as ReactTextInput, Keyboard, TouchableWithoutFeedback, Image, Text, Pressable } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import validator from 'validator'
import * as bookcarsTypes from ':bookcars-types'

import TextInput from '@/components/TextInput'
import Button from '@/components/Button'
import i18n from '@/lang/i18n'
import Error from '@/components/Error'
import * as UserService from '@/services/UserService'
import * as helper from '@/common/helper'
// import Switch from '@/components/Switch'
import Header from '@/components/Header'
import colors from '@/themes/colors'
import GoogleLogo from '@/components/GoogleLogo'

const SignInScreen = ({ navigation, route }: NativeStackScreenProps<StackParams, 'SignIn'>) => {
  const isFocused = useIsFocused()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stayConnected, setStayConnected] = useState(false)

  const [emailRequired, setEmailRequired] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [emailError, setEmailError] = useState(false)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordLengthError, setPasswordLengthError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [blacklisted, setBlacklisted] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const emailRef = useRef<ReactTextInput>(null)
  const passwordRef = useRef<ReactTextInput>(null)

  const clear = () => {
    setEmail('')
    setPassword('')
    setStayConnected(false)

    setEmailRequired(false)
    setEmailValid(true)
    setEmailError(false)
    setPasswordRequired(false)
    setPasswordLengthError(false)
    setPasswordError(false)
    setBlacklisted(false)

    if (emailRef.current) {
      emailRef.current.clear()
    }
    if (passwordRef.current) {
      passwordRef.current.clear()
    }
  }

  const _init = async () => {
    const language = await UserService.getLanguage()
    i18n.locale = language

    clear()
  }

  useEffect(() => {
    if (isFocused) {
      _init()
    }
  }, [route.params, isFocused]) // eslint-disable-line react-hooks/exhaustive-deps

  const validateEmail = async () => {
    if (email) {
      setEmailRequired(false)

      if (validator.isEmail(email)) {
        try {
          const status = await UserService.validateEmail({ email })
          if (status === 204) {
            setEmailError(false)
            setEmailValid(true)
            return true
          }
          setEmailError(true)
          setEmailValid(true)
          return false
        } catch (err) {
          helper.error(err)
          setEmailError(false)
          setEmailValid(true)
          return false
        }
      } else {
        setEmailError(false)
        setEmailValid(false)
        return false
      }
    } else {
      setEmailError(false)
      setEmailValid(true)
      setEmailRequired(true)
      return false
    }
  }

  const onChangeEmail = (text: string) => {
    setEmail(text)
    setEmailRequired(false)
    setEmailValid(true)
    setEmailError(false)
    setPasswordRequired(false)
    setPasswordLengthError(false)
    setPasswordError(false)
  }

  const validatePassword = () => {
    if (!password) {
      setPasswordRequired(true)
      setPasswordLengthError(false)
      return false
    }

    if (password.length < 6) {
      setPasswordLengthError(true)
      setPasswordRequired(false)
      return false
    }

    return true
  }

  const onChangePassword = (text: string) => {
    setPassword(text)
    setPasswordRequired(false)
    setPasswordLengthError(false)
    setPasswordError(false)
  }

  // const onChangeStayConnected = (checked: boolean) => {
  //   setStayConnected(checked)
  // }

  const onPressSignIn = async () => {
    console.log('onPressSignIn', {
      email,
      password
    })

    const _emailValid = await validateEmail()
    if (!_emailValid) {
      return
    }

    const passwordValid = validatePassword()
    if (!passwordValid) {
      return
    }

    const data: bookcarsTypes.SignInPayload = {
      email,
      password,
      stayConnected,
      mobile: true,
    }
    const res = await UserService.signin(data)

    try {
      if (res.status === 200) {
        if (res.data.blacklisted) {
          await UserService.signout(navigation, false)
          setPasswordError(false)
          setBlacklisted(true)
        } else {
          await helper.registerPushToken(res.data._id as string)

          setPasswordError(false)
          setBlacklisted(false)
          clear()
          navigation.navigate('Home', { d: new Date().getTime() })
        }
      } else {
        setPasswordError(true)
        setBlacklisted(false)
      }
    } catch (err) {
      helper.error(err)
    }
  }

  const onPressForgotPassword = () => {
    navigation.navigate('ForgotPassword', {})
  }

  const onPressSignUp = () => {
    navigation.navigate('SignUp', {})
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.master}>
      <Header route={route} title={i18n.t('SIGN_IN_TITLE')} hideTitle={false} loggedIn={false} />
      <View style={styles.img}>
        <Image source={require('../assets/sleekride.png')} style={{ width: 169, height: 100, backgroundColor: 'transparent' }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={helper.android() ? 'handled' : 'always'}
        scrollEnabled={false}
      >
        <View style={styles.contentContainer}>
          <TextInput
            ref={emailRef}
            style={styles.component}
            label={i18n.t('EMAIL')}
            value={email}
            mailIcon
            error={emailRequired || !emailValid || emailError}
            helperText={(emailRequired && i18n.t('REQUIRED')) || (!emailValid && i18n.t('EMAIL_NOT_VALID')) || (emailError && i18n.t('EMAIL_ERROR')) || ''}
            onChangeText={onChangeEmail}
          />

          <TextInput
            ref={passwordRef}
            style={styles.component}
            secureTextEntry={!isPasswordVisible}
            label={i18n.t('PASSWORD')}
            value={password}
            passwordIcon
            error={passwordRequired || passwordLengthError || passwordError}
            helperText={(passwordRequired && i18n.t('REQUIRED')) || (passwordLengthError && i18n.t('PASSWORD_LENGTH_ERROR')) || (passwordError && i18n.t('PASSWORD_ERROR')) || ''}
            onChangeText={onChangePassword}
            onSubmitEditing={onPressSignIn}
            onShowPassword={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <Pressable style={styles.forgotPwd} onPress={onPressForgotPassword}>
            <Text style={styles.stayConnectedText}>{i18n.t('FORGOT_PASSWORD')}</Text>
           </Pressable>

          <Button style={styles.component} label={i18n.t('SIGN_IN')} onPress={() => {
            onPressSignIn()
          }} />

          <View style={styles.link}>
            <Text style={styles.stayConnectedText}>{'Or Login with'}</Text>
          </View>

          <View style={styles.iconContainer}>
            <View style={styles.borderIcon}>
              <GoogleLogo width={26} height={26} />
            </View>
          </View>
          {blacklisted && <Error style={styles.error} message={i18n.t('IS_BLACKLISTED')} />}
        </View>
      </ScrollView>
      <View style={styles.latest}>
        <Text style={styles.account}>{'Don\'t have an account? '}
          <Text onPress={onPressSignUp} style={styles.signup}>Sign up</Text>
        </Text>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
    backgroundColor: colors.background,
  },
  img: {
    alignItems: 'center',
    marginVertical: 40,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // flexGrow: 1,
    marginTop: 20,
    backgroundColor: colors.background,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 480,
    // alignItems: 'center',
  },
  component: {
    alignSelf: 'stretch',
    margin: 10,
  },
  forgotPwd: {
    alignItems: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
  },
  stayConnected: {
    alignSelf: 'stretch',
    marginLeft: 10,
    marginBottom: 10,
  },
  stayConnectedText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: colors.iconColor,
  },
  link: { alignItems: 'center', marginTop: 30, marginBottom: 10 },
  iconContainer: { alignItems: 'center' },
  borderIcon: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    borderColor: colors.borderSuccess,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    marginTop: 15,
  },
  latest: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  account: {
    fontSize: 14,
    color: colors.dark
  },
  signup: {
    color: colors.primary,
    fontWeight: 'bold'
  }
})

export default SignInScreen
