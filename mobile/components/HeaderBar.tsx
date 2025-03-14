import { Platform, StyleSheet, View } from 'react-native'
import { getHeaderHeight } from '@/utils/scale'
import colors from '@/themes/colors'

// eslint-disable-next-line arrow-body-style
const Header = () => {
    return (
        // eslint-disable-next-line react/react-in-jsx-scope
        <View style={[styles.header, { height: getHeaderHeight() }]}>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: colors.headerBg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 25 : 0
      },
      headerText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
      }
})

export default Header
