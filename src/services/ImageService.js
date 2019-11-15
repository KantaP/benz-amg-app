
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Storage } from 'aws-amplify';
class ImageService {
    onImagePicker = async(callback) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        });
      
        // console.log(result);
      
        if (!result.cancelled) {
            const manipResult = await ImageManipulator.manipulateAsync(
                result.uri,
                [{resize: {width: result.width / 3}}],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );
            callback(manipResult);
        }
    }

    async blobUploadImage(fileUri) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", fileUri, true);
            xhr.send(null);
        });
        const { name, type } = blob._data;
        const options = {
            ACL: 'public-read',
            level: "public",
            contentType: type
        };
        return Storage.put(name , blob , options)
    }
}

const imageService = new ImageService();
Object.freeze(imageService);

export default imageService;