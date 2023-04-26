import Video from 'react-native-video';

export function VideoScreen() {
  return (
    <Video
      source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
      controls={true}
      style={{width: 400, height: 400}}
      muted={false}
      repeat={false}
      resizeMode={'cover'}
      volume={1.0}
      rate={1.0}
      ignoreSilentSwitch={'ignore'}
      playWhenInactive={true}
      playInBackground={true}
    />
  );
}
