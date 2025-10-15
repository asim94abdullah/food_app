import * as React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Button, Divider, Text} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Color, Fonts} from '../common/Constants';
import {TypeFile, TypeFormField, UserProfile} from '../common/Type';
import Icon from './Icon';
import Thumbnail from './Thumbnail';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  Permission,
} from 'react-native-permissions';

interface FileUploaderProps {
  field: TypeFormField;
  files: TypeFile[];
  updateFiles: (id: string, file?: any, index?: number) => void;
  onUploadComplete: (fileId: string) => void;
  style?: StyleProp<ViewStyle>;
  isShop?: boolean;
  inspection?: any;
}

const isIos = Platform.OS == 'ios';
const CameraPermission = isIos
  ? PERMISSIONS.IOS.CAMERA
  : PERMISSIONS.ANDROID.CAMERA;

const FileUploader = ({
  field,
  style,
  files = [],
  updateFiles,
  onUploadComplete,
  isShop,
  inspection,
}: FileUploaderProps) => {
  const [showPopup, setShowPopup] = React.useState(false);

  // console.log('inspection fileUpload', inspection);

  // const openCamera = async () => {
  //   try {
  //     setShowPopup(false);
  //     const status = await check(CameraPermission);
  //     if (status != RESULTS.GRANTED) {
  //       const requestStatus = await request(CameraPermission);
  //       if (requestStatus != RESULTS.GRANTED) {
  //         Alert.alert(
  //           'Message',
  //           'Camera permission required, please allow camera persmission.',
  //         );
  //         return;
  //       }
  //     }
  //     launchCamera({
  //       mediaType: 'photo',
  //       quality: 0,
  //     })
  //       .then(result => {
  //         // console.log('result', result);
  //         if (result.didCancel || result.errorCode) {
  //           return;
  //         }
  //         // console.log('camera', result);
  //         if (result.assets && result.assets.length > 0) {
  //           const selectedImage = result.assets[0];
  //           updateFiles(field.id, {
  //             uri: selectedImage.uri,
  //             name: selectedImage.fileName || 'attachment.png',
  //             type: selectedImage.type || 'image/jpg',
  //           });
  //         } else {
  //           console.error('No image selected or an error occurred.');
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error', error);
  //       });
  //   } catch (error) {
  //     Alert.alert('Message', 'Something went wrong. Unable to open camera.');
  //   }
  // };
  const openCamera = async () => {
    try {
      setShowPopup(false);

      let cameraPermission: Permission | undefined;

      if (Platform.OS === 'android') {
        cameraPermission = PERMISSIONS.ANDROID.CAMERA;
      } else if (Platform.OS === 'ios') {
        cameraPermission = PERMISSIONS.IOS.CAMERA;
      }

      // Handle the case where cameraPermission might be undefined
      if (!cameraPermission) {
        Alert.alert('Error', 'Unable to determine the appropriate permission.');
        return;
      }

      const status = await check(cameraPermission);
      if (status !== RESULTS.GRANTED) {
        const requestStatus = await request(cameraPermission);
        if (requestStatus !== RESULTS.GRANTED) {
          Alert.alert(
            'Message',
            'Camera permission required, please allow camera permission.',
          );
          return;
        }
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0,
      });

      // Ensure result.assets is defined before accessing it
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        updateFiles(field.id, {
          uri: selectedImage.uri,
          name: selectedImage.fileName || 'attachment.png',
          type: selectedImage.type || 'image/jpg',
        });
      } else {
        console.error('No image captured or an error occurred.');
      }
    } catch (error) {
      Alert.alert(
        'Message',
        'Something went wrong. Unable to open the camera.',
      );
    }
  };
  const openGalley = async () => {
    try {
      setShowPopup(false);

      let storagePermission: Permission | undefined;
      if (Platform.OS === 'android') {
        if (Number(Platform.Version) >= 33) {
          // Handle Android 13 and above
          storagePermission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          // Handle versions below Android 13
          storagePermission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
      } else if (Platform.OS === 'ios') {
        // Handle iOS permission
        storagePermission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      }
      if (!storagePermission) {
        Alert.alert('Error', 'Unable to determine the appropriate permission.');
        return;
      }

      const status = await check(storagePermission);
      if (status !== RESULTS.GRANTED) {
        const requestStatus = await request(storagePermission);
        if (requestStatus !== RESULTS.GRANTED) {
          Alert.alert(
            'Message',
            'Gallery permission required, please allow access to the Gallery.',
          );
          return;
        }
      }

      launchImageLibrary({
        mediaType: 'photo',
        quality: 0,
      })
        .then(result => {
          if (result.didCancel || result.errorCode) {
            return;
          }

          if (result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            updateFiles(field.id, {
              uri: selectedImage.uri,
              name: selectedImage.fileName || 'attachment.png',
              type: selectedImage.type || 'image/jpg',
            });
          } else {
            console.error('No image selected or an error occurred.');
          }
        })
        .catch(error => {
          console.error('Error selecting image:', error);
        });
    } catch (error) {
      Alert.alert(
        'Message',
        'Something went wrong. Unable to open the gallery.',
      );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Text style={styles.lbl}>{field.name}</Text>
        {files.length > 0 && (
          <Button mode="text" onPress={() => setShowPopup(true)}>
            Add File
          </Button>
        )}
      </View>

      {files.length > 0 ? (
        <FlatList
          data={files}
          horizontal
          renderItem={({item, index}) => (
            <Thumbnail
              item={item}
              onRemove={() => updateFiles(field.id, undefined, index)}
              onUploadComplete={onUploadComplete}
              isShop={isShop}
              inspection={inspection}
            />
          )}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowPopup(true)}>
          <View style={styles.btn}>
            <Text style={styles.lbl}>Choose Image / Video</Text>
            <Icon
              type="Entypo"
              name="camera"
              size={40}
              color={Color.textLight}
              style={{marginTop: 10}}
            />
          </View>
        </TouchableOpacity>
      )}

      <Modal
        transparent
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.title}>Choose an option</Text>
              <Icon
                name="close"
                type="AntDesign"
                size={20}
                onPress={() => setShowPopup(false)}
              />
            </View>
            <TouchableOpacity onPress={openCamera}>
              <View style={styles.item}>
                <Icon
                  type="Feather"
                  name="image"
                  size={30}
                  color={Color.textLight}
                />
                <Text style={styles.itemLabel}>Open Camera</Text>
              </View>
            </TouchableOpacity>

            <Divider style={styles.line} />

            <TouchableOpacity onPress={openGalley}>
              <View style={styles.item}>
                <Icon
                  type="Feather"
                  name="video"
                  size={30}
                  color={Color.textLight}
                />
                <Text style={styles.itemLabel}>Open Gallery</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FileUploader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    flex: 1,
    backgroundColor: '#cfcfcf',
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbl: {
    color: Color.textLight,
    fontFamily: Fonts.UniNeueRegular,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.UniNeueBold,
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    maxHeight: 600,
    backgroundColor: Color.White,
    borderRadius: 10,
    overflow: 'hidden',
    width: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  itemLabel: {
    fontFamily: Fonts.UniNeueRegular,
    marginLeft: 15,
  },
  line: {
    marginTop: 10,
  },
});
