import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useTheme, VStack } from "native-base";
import { Plus } from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

type RouteParamsLocation = {
  latitude: number;
  longitude: number;
};

export function RegisterProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { latitude, longitude } = route.params as RouteParamsLocation;

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

  function handleCreateNewProblem() {
    setIsLoading(true);
    const data = {
      title,
      description,
      latitude,
      longitude,
      status: "open",
      photos,
    };
    api
      .post("problem", data)
      .then((response) => {
        console.log(response.data);
        navigation.navigate("home");
        return Alert.alert("Cadastro", "Solicitação feita com sucesso!");
      })
      .catch((err) => {
        console.log(err);
        return Alert.alert("Cadastro", "Ops! algo deu errado.");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
