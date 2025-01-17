import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions from iPhone 11
const baseWidth = 414;
const baseHeight = 896;

// Scaling factors
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

// Use this for scaling sizes
export const scale = (size) => {
  const newSize = size * widthScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Use this for vertical scaling (margins, paddings, heights)
export const verticalScale = (size) => {
  const newSize = size * heightScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Use this for elements that should scale moderately
export const moderateScale = (size, factor = 0.5) => {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Screen dimensions helper
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Platform-specific shadow
export const getShadowStyle = (elevation = 5) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation/2,
      },
      shadowOpacity: 0.25,
      shadowRadius: elevation,
    };
  } else {
    return {
      elevation: elevation,
    };
  }
};

// Safe area padding based on device
export const getSafeAreaPadding = () => {
  const isIphoneX = Platform.OS === 'ios' && 
    (SCREEN_HEIGHT >= 812 || SCREEN_WIDTH >= 812);

  return {
    paddingTop: isIphoneX ? 44 : Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: isIphoneX ? 34 : 0,
  };
};

// Common styles that need to be responsive
export const commonStyles = {
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  headerText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: moderateScale(16),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  inputField: {
    height: verticalScale(50),
    fontSize: moderateScale(16),
    paddingHorizontal: scale(15),
  },
  card: {
    borderRadius: scale(15),
    padding: scale(15),
    marginVertical: verticalScale(10),
    ...getShadowStyle(5),
  },
};

// Grid system for different screen sizes
export const getGridDimensions = (columns = 2, margin = 10) => {
  const totalMargin = margin * (columns + 1);
  const itemWidth = (SCREEN_WIDTH - totalMargin) / columns;
  return {
    itemWidth,
    margin,
  };
}; 