import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView, View, TextInput as ReactTextInput, Keyboard, TouchableWithoutFeedback, Image, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import validator from 'validator'
import * as bookcarsTypes from ':bookcars-types'

import i18n from '@/lang/i18n'
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'
import * as UserService from '@/services/UserService'
import * as helper from '@/common/helper'
import * as env from '@/config/env.config'
import Error from '@/components/Error'
import Backdrop from '@/components/Backdrop'
import Header from '@/components/Header'
import colors from '@/themes/colors'
import GoogleLogo from '@/components/GoogleLogo'

const SignUpScreen = ({ navigation, route }: NativeStackScreenProps<StackParams, 'SignUp'>) => {
  const isFocused = useIsFocused()
  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState<Date>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [tosChecked, setTosChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailRequired, setEmailRequired] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [emailError, setEmailError] = useState(false)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [confirmPasswordRequired, setConfirmPasswordRequired] = useState(false)
  const [passwordLengthError, setPasswordLengthError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [tosError, setTosError] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const fullNameRef = useRef<ReactTextInput>(null)
  const emailRef = useRef<ReactTextInput>(null)
  const phoneRef = useRef<ReactTextInput>(null)
  const passwordRef = useRef<ReactTextInput>(null)
  const confirmPasswordRef = useRef<ReactTextInput>(null)

  const _init = async () => {
    const _language = await UserService.getLanguage()
    i18n.locale = _language
    setLanguage(_language)

    setFullName('')
    setEmail('')
    setPhone('')
    setBirthDate(undefined)
    setPassword('')
    setConfirmPassword('')
    setTosChecked(false)
    setEmailRequired(false)
    setEmailValid(true)
    setEmailError(false)
    setPasswordRequired(false)
    setPasswordLengthError(false)
    setConfirmPasswordRequired(false)
    setConfirmPasswordError(false)
    setTosError(false)

    if (fullNameRef.current) {
      fullNameRef.current.clear()
    }
    if (emailRef.current) {
      emailRef.current.clear()
    }
    if (phoneRef.current) {
      phoneRef.current.clear()
    }
    if (passwordRef.current) {
      passwordRef.current.clear()
    }
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.clear()
    }
  }

  useEffect(() => {
    if (isFocused) {
      _init()
    }
  }, [route.params, isFocused])

  const validateEmail = async () => {
    if (email) {
      setEmailRequired(false)

      if (validator.isEmail(email)) {
        try {
          const status = await UserService.validateEmail({ email })
          if (status === 200) {
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

    if (!confirmPassword) {
      setConfirmPasswordRequired(true)
      setConfirmPasswordError(false)
      return false
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true)
      setConfirmPasswordRequired(false)
      return false
    }

    return true
  }

  const onChangePassword = (text: string) => {
    setPassword(text)
    setPasswordRequired(false)
    setPasswordLengthError(false)
  }

  const onChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text)
    setConfirmPasswordRequired(false)
    setConfirmPasswordError(false)
  }

  const error = (err?: unknown) => {
    helper.error(err)
    setLoading(false)
  }

  const onPressSignUp = async () => {
    try {
      fullNameRef.current?.blur()
      emailRef.current?.blur()
      phoneRef.current?.blur()
      passwordRef.current?.blur()
      confirmPasswordRef.current?.blur()

      const _emailValid = await validateEmail()
      if (!_emailValid) {
        return
      }

      const passwordValid = validatePassword()
      if (!passwordValid) {
        return
      }

      if (!tosChecked) {
        setTosError(true)
        return
      }

      setLoading(true)

      const data: bookcarsTypes.SignUpPayload = {
        email,
        phone,
        password,
        fullName,
        birthDate,
        language,
      }

      const status = await UserService.signup(data)

      if (status === 200) {
        const result = await UserService.signin({ email, password })

        if (result.status === 200) {
          navigation.navigate('Home', { d: new Date().getTime() })
        } else {
          error()
        }
      } else {
        error()
      }
    } catch (err) {
      error(err)
    }
  }

  const onPressSignIn = () => {
    navigation.navigate('SignIn', {})
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.master}>
      <Header route={route} title={i18n.t('SIGN_UP_TITLE')} hideTitle={false} loggedIn={false} />
      <View style={styles.img}>
        <Image source={require('../assets/sleekride.png')} style={{ width: 169, height: 100, backgroundColor: 'transparent' }} />
      </View>

      {language && (
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={helper.android() ? 'handled' : 'always'}
        >
          <View style={styles.contentContainer}>
            <TextInput
              ref={emailRef}
              style={styles.component}
              label={i18n.t('EMAIL')}
              value={email}
              mailIcon
              error={emailRequired || !emailValid || emailError}
              helperText={(emailRequired && i18n.t('REQUIRED')) || (!emailValid && i18n.t('EMAIL_NOT_VALID')) || (emailError && i18n.t('EMAIL_ALREADY_REGISTERED')) || ''}
              onChangeText={onChangeEmail}
            />
            <TextInput
              ref={passwordRef}
              style={styles.component}
              secureTextEntry={!isPasswordVisible}
              label={i18n.t('PASSWORD')}
              value={password}
              error={passwordRequired || passwordLengthError}
              helperText={(passwordRequired && i18n.t('REQUIRED')) || (passwordLengthError && i18n.t('PASSWORD_LENGTH_ERROR')) || ''}
              onChangeText={onChangePassword}
              onShowPassword={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <TextInput
              ref={confirmPasswordRef}
              style={styles.component}
              secureTextEntry={!isPasswordVisible}
              label={i18n.t('CONFIRM_PASSWORD')}
              value={confirmPassword}
              error={confirmPasswordRequired || confirmPasswordError}
              helperText={(confirmPasswordRequired && i18n.t('REQUIRED')) || (confirmPasswordError && i18n.t('PASSWORDS_DONT_MATCH')) || ''}
              onChangeText={onChangeConfirmPassword}
              onShowPassword={() => setIsPasswordVisible(!isPasswordVisible)}
            />
            <Button style={styles.component} label={i18n.t('SIGN_UP')} onPress={onPressSignUp} />

            <View style={styles.link}>
              <Text style={styles.stayConnectedText}>{'Or Sign Up with'}</Text>
            </View>

            <View style={styles.iconContainer}>
            <View style={styles.borderIcon}>
              <GoogleLogo width={26} height={26} />
            </View>
          </View>

            {tosError && <Error message={i18n.t('TOS_ERROR')} />}
          </View>
        </ScrollView>
      )}

      {loading && <Backdrop message={i18n.t('PLEASE_WAIT')} />}
      <View style={styles.latest}>
        <Text style={styles.account}>{'Already have an account? '}
          <Text onPress={onPressSignIn} style={styles.signup}>Sign In</Text>
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
    alignItems: 'center',
  },
  component: {
    alignSelf: 'stretch',
    margin: 10,
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

export default SignUpScreen
