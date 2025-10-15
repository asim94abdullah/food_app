import * as React from 'react';
import {View, StyleSheet, Image, ActivityIndicator, Alert} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {Text} from 'react-native-paper';
import {TypeFile, UserProfile} from '../common/Type';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import Api from '../api';
import {getDataFrom, handleError} from '../common/Utils';
import Icon from './Icon';

interface ThumbnailProps {
  item: TypeFile;
  onRemove: () => void;
  onUploadComplete: (fileId: string) => void;
  isShop?: boolean;
  inspection: any;
}

const Thumbnail = ({
  item,
  onRemove,
  onUploadComplete,
  isShop,
  inspection,
}: ThumbnailProps) => {
  const [isUploading, setIsUploading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  console.log('inspection thumbnail', inspection);

  const uploadAttachment = () => {
    // console.log('uploading..', item);
    // if(item){
    //     return
    // }
    const data = new FormData();
    data.append('file', item);
    data.append('inspection_id', inspection);
    console.log('fileee asimmmm', data);

    let request = isShop
      ? api.uploadShopAttachment(data, (e: any) => {
          // console.log('imageee shop', data);
          const percentFraction = e.loaded / e.total;
          const percent = Math.floor(percentFraction * 100);
          setProgress(percent);
        })
      : api.uploadInspectionAttachment(data, (e: any) => {
          // console.log('imageee attacth', data);
          const percentFraction = e.loaded / e.total;
          const percent = Math.floor(percentFraction * 100);
          setProgress(percent);
        });

    request
      .then(async response => {
        // console.log('before GetForm data', response);
        const respData = await getDataFrom(response);
        // console.log('after GetForm data', respData);

        if (respData) {
          setIsUploading(false);
          onUploadComplete(respData.file_id);
        } else {
          Alert.alert(
            'Image Uploaded Error',
            'Image is not uploaded server error!',
          );
          onRemove();
        }
      })
      .catch(error => {
        console.log('errorrrr', error);

        handleError(error);
        onRemove();
      });
  };

  React.useEffect(uploadAttachment, []);

  return (
    <View style={styles.thumbnailWrapper}>
      <Image source={{uri: item.uri}} style={styles.thumbnail} />

      <View style={styles.overlay}>
        {isUploading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'small'} color="white" />
            <Text style={styles.txtWhite}>Uploading {'\n' + progress}%</Text>
          </View>
        ) : (
          <Icon
            type="Entypo"
            name="circle-with-cross"
            color={'white'}
            size={20}
            onPress={onRemove}
          />
        )}
      </View>
    </View>
  );
};

export default Thumbnail;

const styles = StyleSheet.create({
  thumbnailWrapper: {
    width: 100,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: 100,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'flex-end',
    padding: 10,
  },
  txtWhite: {
    color: 'white',
    // backgroundColor: 'red',
    textAlign: 'center',
    // marginTop: 30,
  },
});
