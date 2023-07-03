import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
  ImageBackground,
} from 'react-native';
import {palette} from '../../utils/palette';
import {images} from '../../utils/images';
import AppText from '../../component/AppText';
import AppButton from '../../component/AppButton';
import BaseScreen from '../base_screen';

const SimpleComponentScreen = React.memo(() => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [refreshing, setRefreshing] = React.useState(false);
  const [number, onChangeNumber] = React.useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <BaseScreen screenName="SimpleComponentScreen">
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <AppText style={styles.pullDownText}>
            Pull down to see RefreshControl indicator
          </AppText>

          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="Placeholder"
            keyboardType="numeric"
          />

          <Switch
            trackColor={{false: palette.green, true: palette.customBlue}}
            thumbColor={isEnabled ? palette.pastelYellow : palette.alto}
            ios_backgroundColor={palette.pastelPurple}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />

          <View style={[styles.activityContainer]}>
            <ActivityIndicator />
            <ActivityIndicator size="large" />
            <ActivityIndicator size="small" color={palette.customBlue} />
            <ActivityIndicator size="large" color={palette.pastelGreen} />
          </View>

          <View style={[styles.activityContainer]}>
            <Image style={styles.tinyLogo} source={images.pizza} />
            <Image
              style={styles.tinyLogo}
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
          </View>

          <ImageBackground
            source={{uri: 'https://reactjs.org/logo-og.png'}}
            resizeMode="cover"
            style={styles.imageBackground}>
            <AppText style={styles.imageBackgroundTxt}>Inside</AppText>
          </ImageBackground>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <AppText style={styles.modalText}>Hello World!</AppText>
                <AppButton
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <AppText style={styles.textStyle}>Hide Modal</AppText>
                </AppButton>
              </View>
            </View>
          </Modal>
          <AppButton
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <AppText style={styles.textStyle}>Show Modal</AppText>
          </AppButton>
        </ScrollView>
      </View>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pullDownText: {color: palette.black, marginVertical: 15},
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
    borderRadius: 6,
  },
  activityContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  switch: {marginVertical: 20},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: palette.skyBlue,
  },
  buttonClose: {
    backgroundColor: palette.pastelGreen,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: palette.pastelPurple,
    marginBottom: 15,
    textAlign: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 50,
  },
  imageBackgroundTxt: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: `${palette.black}c0`,
    padding: 50,
  },
});

export default SimpleComponentScreen;
