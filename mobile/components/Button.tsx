import React from 'react'
import { StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native'
import colors from '@/themes/colors'

interface ButtonProps {
  size?: 'small'
  color?: string
  style?: object
  label: string
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
}

const Button = ({
  size,
  color,
  style,
  label,
  loading,
  disabled,
  onPress: onButtonPress
}: ButtonProps) => {
  const small = size === 'small'

  const onPress = () => {
    if (onButtonPress) {
      onButtonPress()
    }
  }

  const styles = StyleSheet.create({
    button: {
      height: small ? 37 : 55,
      borderRadius: 10,
      backgroundColor: color === 'secondary' ? '#999' : colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 480,
    },
    text: {
      color: '#fff',
      textTransform: 'uppercase',
      fontSize: small ? 14 : 17,
      fontWeight: '600',
    },
  })

  return (
    <Pressable disabled={disabled} style={{ ...style, ...styles.button }} onPress={onPress}>
      {loading ? <ActivityIndicator size={10} color={colors.white} /> : <Text style={styles.text}>{label}</Text>}
    </Pressable>
  )
}

export default Button
