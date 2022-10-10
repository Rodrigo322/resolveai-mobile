import { useRoute } from "@react-navigation/native";
import {
  Box,
  HStack,
  Icon,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from "native-base";
import {
  CircleWavyCheck,
  Clipboard,
  Clock,
  Hourglass,
  ShieldWarning,
  Trash,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";

import { Header } from "../components/Header";
import { ProblemProps } from "../components/Problem";

import mapMarker from "../assets/map.png";

import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { api } from "../services/api";

type RouteParams = {
  problemId: string;
};

type ProblemDetails = ProblemProps & {
  description: string;
  solution: string;
  latitude: number;
  longitude: number;
  closed: string;
  Image: Array<{
    id: number;
    path: string;
  }>;
};

export function Details() {
  const { colors } = useTheme();

  const [problem, setProblem] = useState<ProblemDetails>();

  const route = useRoute();
  const { problemId } = route.params as RouteParams;

  function handleOpenGoogleMapRoutes() {
    Linking.openURL(
      `http://www.google.com/maps/dir/?api=1&destination=${problem?.latitude},${problem?.longitude}`
    );
  }

  useEffect(() => {
    api.get(`/problem/${problemId}`).then((response) => {
      setProblem(response.data);
      console.log(problem);
    });
  }, []);

  return (
    <VStack flex={1} bg="gray.700">
      <Box bg="gray.600" px={6}>
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {problem.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            problem.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {problem.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal pagingEnabled>
          {problem.Image.map((image) => {
            return (
              <Image
                key={image.id}
                style={styles.image}
                source={{
                  uri: image.path,
                }}
              />
            );
          })}
        </ScrollView>
        <CardDetails
          title="título"
          description={problem.title}
          icon={ShieldWarning}
          footer={"12/05/22"}
        />
        <CardDetails
          title="descrição do problema"
          description={problem.description}
          icon={Clipboard}
        />
        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={
            problem.status === "open"
              ? "Problema ainda não solucionado"
              : problem.solution
          }
          footer={problem.closed && `Encerrado em ${problem.closed}`}
        />

        <CardDetails
          title="Entidade Responsável"
          icon={Clock}
          description={
            problem.status === "open"
              ? "Aguardando entidade para solução"
              : problem.solution
          }
        />
        <VStack bg="gray.600" mt={5} rounded="sm">
          <MapView
            initialRegion={{
              latitude: -27.2092052,
              longitude: -49.6401092,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker
              icon={mapMarker}
              coordinate={{
                latitude: -27.2092052,
                longitude: -49.6401092,
              }}
            />
          </MapView>
          <TouchableOpacity
            onPress={handleOpenGoogleMapRoutes}
            style={styles.routerContainer}
          >
            <Text fontSize="md" color={colors.secondary[700]}>
              Ver rotas no Google Maps
            </Text>
          </TouchableOpacity>
        </VStack>
        <Button
          bg="secondary.700"
          _pressed={{
            bg: "secondary.600",
          }}
          title="Remover solitação"
          m={5}
          leftIcon={<Icon as={<Trash color={colors.gray[100]} />} />}
        />
      </ScrollView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: 150,
  },
  image: {
    width: Dimensions.get("window").width,
    height: 240,
    resizeMode: "cover",
  },
  routerContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
