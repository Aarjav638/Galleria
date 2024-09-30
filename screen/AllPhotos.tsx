import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import hasAndroidPermission from '../utils/checkPermissions';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH / 4 - 6;

const PhotoItem = React.memo(
  ({item, onEdit}: {item: {uri: string}; onEdit: (uri: string) => void}) => {
    return (
      <TouchableOpacity onPress={() => onEdit(item.uri)}>
        <Image
          source={{uri: item.uri}}
          style={style.imageItem}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  },
);

const AllPhotos = () => {
  interface Photo {
    filename: string | null;
    filepath: string | null;
    extension: string | null;
    uri: string;
    height: number;
    width: number;
    fileSize: number | null;
    playableDuration: number;
    orientation: number | null;
  }

  const [url, setUrl] = useState<string>('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPhotos = useCallback(
    async (refresh = false) => {
      if (loading || loadingMore || (!refresh && !hasNextPage)) {
        return;
      }

      if (refresh) {
        setRefreshing(true);
        setAfter(undefined);
        setPhotos([]);
      } else if (after) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const result = await CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
          after: refresh ? undefined : after,
        });

        const newPhotos = result.edges.map(edge => edge.node.image);
        setPhotos(prevPhotos =>
          refresh ? newPhotos : [...prevPhotos, ...newPhotos],
        );
        setAfter(result.page_info.end_cursor);
        setHasNextPage(result.page_info.has_next_page);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [loading, loadingMore, hasNextPage, after],
  );

  const checkPermissionAndLoadPhotos = useCallback(async () => {
    const permission = await hasAndroidPermission();
    setPermissionGranted(permission);
    if (permission) {
      loadPhotos();
    }
  }, [loadPhotos]);

  useEffect(() => {
    checkPermissionAndLoadPhotos();
  }, [checkPermissionAndLoadPhotos]);

  const renderSkeletonItem = () => <View style={style.skeletonItem} />;

  if (!permissionGranted) {
    return (
      <View style={style.permissionContainer}>
        <Text style={style.permissionText}>
          Please grant the necessary permissions to view photos.
        </Text>
      </View>
    );
  }

  const editImage = (uri: string) => {
    ImagePicker.openCropper({
      path: uri,
      width: 300,
      height: 400,
      mediaType: 'photo',
    })
      .then(image => {
        const editedPhotos = photos.map(photo =>
          photo.uri === uri ? {...photo, uri: image.path} : photo,
        );
        setPhotos([...editedPhotos]);
      })
      .catch(err => {
        console.log('Error editing image:', err);
      });
  };

  const validateAndAddImage = async () => {
    try {
      const response = await axios.head(url);
      const contentType = response.headers['content-type'];
      console.log('Content-Type:', contentType);
      if (contentType.startsWith('image/')) {
        const newPhoto = {
          uri: url,
          filename: null,
          filepath: null,
          extension: null,
          height: 0,
          width: 0,
          fileSize: null,
          playableDuration: 0,
          orientation: null,
        };
        setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);

        Alert.alert('Success', 'Image added successfully.');
        setUrl('');
      } else {
        Alert.alert(
          'Invalid Image',
          'The URL does not point to a valid image.',
        );
      }
    } catch (error) {
      console.log('Error validating URL:', error);
      Alert.alert('Error', 'Failed to load the image from the URL.');
    }
  };

  return (
    <View style={style.container}>
      <View style={style.urlInputContainer}>
        <TextInput
          style={style.urlInput}
          placeholder="Enter image URL"
          placeholderTextColor={'#ccc'}
          value={url}
          onChangeText={setUrl}
        />
        <TouchableOpacity onPress={validateAndAddImage} style={style.button}>
          <Text>Add Image</Text>
        </TouchableOpacity>
      </View>
      {initialLoading ? (
        <FlatList
          data={Array(20).fill({})}
          renderItem={renderSkeletonItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
        />
      ) : (
        <FlatList
          data={photos}
          showsVerticalScrollIndicator
          renderItem={({item}) => <PhotoItem item={item} onEdit={editImage} />}
          keyExtractor={(item, index) => item.uri + index.toString()}
          numColumns={4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPhotos(true)}
            />
          }
          onEndReached={() => {
            if (!loading && !loadingMore && hasNextPage) {
              loadPhotos();
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={style.paginationLoader}>
                <FlatList
                  data={Array(20).fill({})}
                  renderItem={renderSkeletonItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={4}
                />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlInputContainer: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  urlInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    padding: 10,
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#333',
  },
  imageItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 3,
  },
  skeletonItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 3,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  paginationLoader: {
    marginTop: 10,
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AllPhotos;
