import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Pressable, Text, Platform, StyleProp, ViewStyle } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { format } from 'date-fns'
import { enUS, fr, es } from 'date-fns/locale'
import { MaterialIcons } from '@expo/vector-icons'
import * as bookcarsHelper from ':bookcars-helper'
import colors from '@/themes/colors'

interface DateTimePickerProps {
  value?: Date
  locale?: string,
  mode?: 'date' | 'datetime' | 'time'
  size?: 'small'
  label: string
  backgroundColor?: string
  error?: boolean
  style?: StyleProp<ViewStyle>
  helperText?: string
  minDate?: Date
  maxDate?: Date
  readOnly?: boolean
  hideClearButton?: boolean
  onPress?: () => void
  onChange?: (date: Date | undefined) => void
}

const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  value: initialValue,
  locale: initialLocale = 'en',
  mode = 'date',
  size,
  label,
  backgroundColor,
  error,
  style,
  helperText,
  minDate,
  maxDate,
  readOnly,
  hideClearButton,
  onPress,
  onChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialValue)
  const [showPicker, setShowPicker] = useState(false)
  const [formattedLabel, setFormattedLabel] = useState(label)

  const localeMap = { fr, es, en: enUS }
  const dateLocale = localeMap[initialLocale as keyof typeof localeMap] || enUS
  const dateFormat = mode === 'date' ? 'eeee, d LLLL yyyy' : 'kk:mm'
  const small = size === 'small'

  useEffect(() => {
    if (selectedDate) {
      setFormattedLabel(bookcarsHelper.capitalize(format(selectedDate, dateFormat, { locale: dateLocale })))
    } else {
      setFormattedLabel(label)
    }
  }, [selectedDate, initialLocale]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedDate(initialValue)
  }, [initialValue])

  const handleDateChange = useCallback((date?: Date) => {
    setShowPicker(false)
    if (date) {
      setSelectedDate(date)
      onChange?.(date)
    }
  }, [onChange])

  const handleClear = useCallback(() => {
    setSelectedDate(undefined)
    setFormattedLabel(label)
    onChange?.(undefined)
  }, [label, onChange])

  const styles = StyleSheet.create({
    container: {
      maxWidth: 480,
    },
    label: {
      backgroundColor: '#1e1e1f',
      color: '#fff',
      fontSize: 12,
      fontWeight: '400',
      paddingRight: 5,
      paddingLeft: 5,
      marginLeft: 15,
      position: 'absolute',
      top: -10,
      zIndex: 1,
    },
    dateContainer: {
      alignSelf: 'stretch',
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.borderInput,
      backgroundColor: '#1e1e1f',
    },
    dateButton: {
      alignSelf: 'stretch',
      flexDirection: 'row',
    },
    dateText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 16,
      paddingVertical: 8,
      paddingRight: 15,
      paddingLeft: 15,
    },
    helperText: {
      color: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)',
      fontSize: 12,
      fontWeight: '400',
      paddingLeft: 5,
    },
    clear: {
      flex: 0,
      position: 'absolute',
      right: 10,
      top: small ? 7 : 17,
    },
  })

  return (
    <View style={[styles.container, style]}>
      {selectedDate && <Text style={styles.label}>{label}</Text>}

      <View style={styles.dateContainer}>
        <Pressable
          style={styles.dateButton}
          onPress={() => {
            setShowPicker(true)
            onPress?.()
          }}
        >
          <Text style={[styles.dateText, { color: selectedDate ? '#fff' : '#fff' }]}>
            {formattedLabel}
          </Text>

          {!readOnly && selectedDate && !hideClearButton && (
            <MaterialIcons style={styles.clear} name="clear" size={22} color="rgba(0, 0, 0, 0.28)" onPress={handleClear} />
          )}
        </Pressable>

        {showPicker && Platform.select({
          android: (
            <DateTimePicker
              mode={mode}
              value={selectedDate || new Date()}
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={(event, date) => handleDateChange(date ?? selectedDate)}
            />
          ),
          ios: (
            <DateTimePickerModal
              isVisible={showPicker}
              mode={mode}
              date={selectedDate || new Date()}
              minimumDate={minDate}
              maximumDate={maxDate}
              onConfirm={handleDateChange}
              onCancel={() => setShowPicker(false)}
            />
          )
        })}

        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    </View>
  )
}

export default CustomDateTimePicker
