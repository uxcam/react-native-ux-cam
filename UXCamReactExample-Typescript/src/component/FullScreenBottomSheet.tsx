import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import RNUxcam from 'react-native-ux-cam';

const { height: screenHeight } = Dimensions.get('window');

interface FullScreenBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const FullScreenBottomSheet: React.FC<FullScreenBottomSheetProps> = ({ 
  isVisible,
  onClose  // Make sure to destructure onClose
}) => {

  return (
    <View>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}  // Use onClose here
        onSwipeComplete={onClose}  // Use onClose here
        swipeDirection={['down']}
        style={styles.modal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
      >
        <View style={styles.bottomSheet}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />
          
          {/* Content */}
          <View style={styles.content}>
            <Text
              ref={label => {
                RNUxcam.occludeSensitiveView(label);
              }} 
            >
              Label hidden from UXCam
            </Text>
            
            <TextInput
              value=""
              onChangeText={_ => {}}
              placeholder="Type something here..."
              placeholderTextColor="#999"
              ref={label => {
                RNUxcam.occludeSensitiveView(label);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FullScreenBottomSheet;

// Add these styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modal: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      bottomSheet: {
        backgroundColor: 'white',
        height: screenHeight * 0.7, // 70% of screen height
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
      },
      dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
      },
      content: {
        flex: 1,
        paddingHorizontal: 20,
      },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
    },
});