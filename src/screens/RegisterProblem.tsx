import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useTheme, VStack } from "native-base";
import { Plus } from "phosphor-react-native";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { AuthContext } from "../contexts/auth";

import { api } from "../services/api";

export function RegisterProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const { colors } = useTheme();

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Eitá, precisamos de acesso ás suas fotos..");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    const { uri: photo } = result as ImageInfo;

    setPhotos([...photos, photo]);
  }

  async function handleCreateNewProblem() {
    try {
      setIsLoading(true);
      const storageLatitude = await AsyncStorage.getItem("@storage:latitude");
      const storageLongitude = await AsyncStorage.getItem("@storage:longitude");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", storageLatitude);
      formData.append("longitude", storageLongitude);
      formData.append("status", "open");

      photos.map((photo, index) => {
        return formData.append("images", {
          name: `image-${index}.jpeg`,
          uri: photo,
          type: "image/jpeg",
        } as any);
      });

      const response = await api.post(`/problem/user/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.id) {
        setIsLoading(false);
        navigation.navigate("home");
        Alert.alert("Sucess", "Resgistro feito com sucesso!");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Alert.alert("error", error);
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          onChangeText={setTitle}
          placeholder="Título do problema"
          mt={4}
        />

        <Input
          placeholder="Descrição do problema"
          flex={1}
          h={350}
          mt={5}
          multiline
          textAlignVertical="top"
          onChangeText={setDescription}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.uploadedImagesContainer}>
            {photos.map((photo) => {
              return (
                <Image
                  key={photo}
                  source={{ uri: photo }}
                  style={styles.uploadedImage}
                />
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.imagesInput}
          onPress={handleSelectImages}
        >
          <Plus color={colors.gray[300]} size={32} />
        </TouchableOpacity>
        <Button
          onPress={handleCreateNewProblem}
          isLoading={isLoading}
          title="Cadastrar"
          mt={5}
        />
      </ScrollView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  uploadedImagesContainer: {
    flexDirection: "row",
  },
  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 8,
  },
  imagesInput: {
    backgroundColor: "#121214",
    borderStyle: "dashed",
    borderColor: "#00875F",
    borderWidth: 1.4,
    borderRadius: 9,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});
