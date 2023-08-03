import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

import UserCustomProperty from './UserCustomProperty';
import AppButton from '../../../component/AppButton';
import {palette} from '../../../utils/palette';
import BaseScreen from '../../base_screen';
import UserIdentity from './UserIdentity';
import {global_styles} from '../../../utils/globalStyles';

const UserDetailsScreen = React.memo(() => {
  const onPressTagCustomProperty = useCallback(
    (property: string, propertyValue: string) => {
      console.log(`New Property set => ${property}: ${propertyValue}`);
      RNUxcam.setUserProperty(property, propertyValue);
    },
    [],
  );

  const onPressUserIdentity = useCallback((identity: string) => {
    RNUxcam.setUserIdentity(identity);
    console.log('New identity =', identity);
  }, []);

  const onPressSetCompanyNameRole = useCallback(() => {
    let companyKey = 'Company Name';
    let companyValue = 'UXCam';
    RNUxcam.setUserProperty(companyKey, companyValue);
    console.log(`New Property set => ${companyKey}: ${companyValue}`);

    let roleKey = 'Role';
    let roleValue = 'React Native Engineer';
    RNUxcam.setUserProperty(roleKey, roleValue);
    console.log(`New Property set => ${roleKey}: ${roleValue}`);
  }, []);

  const onPressSetPositionLevel = useCallback(() => {
    RNUxcam.setUserProperty('IsSenior', 'True');
    console.log('New Property set => IsSenior: True');
  }, []);

  return (
    <BaseScreen screenName="UserDetailsScreen">
      <View style={styles.container}>
        <UserIdentity onPressButton={onPressUserIdentity} />

        <AppButton
          text="Set Company Name, Role"
          containerStyle={styles.button}
          onPress={onPressSetCompanyNameRole}
          textStyle={global_styles.buttontText}
        />

        <AppButton
          text="Set Position Level"
          containerStyle={styles.button}
          onPress={onPressSetPositionLevel}
          textStyle={global_styles.buttontText}
        />

        <UserCustomProperty onPressButton={onPressTagCustomProperty} />
      </View>
    </BaseScreen>
  );
});

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    ...global_styles.button,
    backgroundColor: palette.customBlue,
  },
});
