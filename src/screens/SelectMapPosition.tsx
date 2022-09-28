import { useNavigation } from "@react-navigation/native";
import { Box, Icon, useTheme, VStack } from "native-base";
import { ArrowRight } from "phosphor-react-native";
import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import mapMarker from "../assets/map.png";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function SelectMapPosition() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleNextStep() {
    navigation.navigate("register", { position });
  }

  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <VStack flex={1} bg="gray.600" alignItems="center">
      <Box bg="gray.600" px={6}>
        <Header title="Selecione a Localização" />
      </Box>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -14.0946709,
          longitude: -46.6222736,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onPress={handleSelectMapPosition}
      >
        {position.latitude !== 0 && (
          <Marker
            icon={mapMarker}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView>

      {position.latitude !== 0 && (
        <Button
          onPress={handleNextStep}
          bg="green.500"
          _pressed={{
            bg: "green.300",
          }}
          position="absolute"
          bottom={10}
          w={350}
          title="Próximo"
          rightIcon={<Icon as={<ArrowRight color={colors.gray[50]} />} />}
        />
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
