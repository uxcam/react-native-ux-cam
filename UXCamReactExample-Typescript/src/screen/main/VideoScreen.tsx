import React from 'react';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';

import BaseScreen from '../base_screen';

const VideoScreen = React.memo(() => {
  return (
    <BaseScreen screenName="VideoScreen">
      <Video
        source={{
          uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        controls={true}
        style={styles.video}
        muted={false}
        repeat={false}
        resizeMode={'cover'}
        volume={1.0}
        rate={1.0}
        ignoreSilentSwitch={'ignore'}
        playWhenInactive={true}
        playInBackground={true}
      />
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  video: {width: 400, height: 400},
});

export default VideoScreen;
