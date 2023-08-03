import {View} from 'react-native';
import React from 'react';
import {palette} from '../utils/palette';

type LineProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
};

const Line: React.FC<LineProps> = React.memo(
  ({width, height, backgroundColor = palette.darkGray}) => {
    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: backgroundColor,
        }}
      />
    );
  },
);

export default Line;
