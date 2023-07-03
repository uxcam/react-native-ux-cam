import React, {useRef, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';
import BaseScreen from '../base_screen';

const WebViewScreen = React.memo(() => {
  const webviewRef = useRef<WebView>(null);
  const [webViewLoading, setWebViewLoading] = useState<boolean>(true);
  const url = 'https://developer.uxcam.com/';

  function handleVideoEvents(event: any) {
    const eventObj = JSON.parse(event.nativeEvent.data);
    const message = eventObj.message;
    const data = eventObj.data;
    console.log(message, data);
  }

  return (
    <BaseScreen screenName="WebViewScreen">
      <WebView
        ref={webviewRef}
        scalesPageToFit={false}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        javaScriptEnabled={true}
        pagingEnabled={true}
        source={{uri: url}}
        originWhitelist={['*']}
        style={styles.webView}
        onLoadStart={({nativeEvent}) => {
          setWebViewLoading(nativeEvent.loading);
        }}
        onLoadEnd={({nativeEvent}) => {
          setWebViewLoading(nativeEvent.loading);
        }}
        onMessage={event => handleVideoEvents(event)}
      />
      {webViewLoading && (
        <ActivityIndicator size={'large'} style={styles.indicator} />
      )}
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
  indicator: {position: 'absolute', alignSelf: 'center'},
});

export default WebViewScreen;
