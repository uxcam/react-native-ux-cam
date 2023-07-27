import {View} from 'react-native';
import React from 'react';

type SpacerProps = {
  width?: number;
  height?: number;
};

const Spacer: React.FC<SpacerProps> = React.memo(({width, height}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
      }}
    />
  );
});

export default Spacer;
