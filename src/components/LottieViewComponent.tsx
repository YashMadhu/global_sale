import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import LottieView from 'lottie-react-native'

interface LottieViewComponentProps {
  source: any
  autoPlay?: boolean
  loop?: boolean
  style?: ViewStyle
  width?: number
  height?: number
  speed?: number
  onAnimationFinish?: () => void
}

const LottieViewComponent: React.FC<LottieViewComponentProps> = ({
  source,
  autoPlay = true,
  loop = true,
  style,
  width = 200,
  height = 200,
  speed = 1,
  onAnimationFinish,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={{ width, height }}
        speed={speed}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LottieViewComponent


