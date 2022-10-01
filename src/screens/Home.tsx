import { useNavigation } from "@react-navigation/native";
import {
  Button as ButtonNativeBase,
  Center,
  FlatList,
  Heading,
  HStack,
  Image,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { ChatCenteredText } from "phosphor-react-native";
import { useContext, useEffect, useState } from "react";

import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";

import { Filter } from "../components/Filter";
import { Loading } from "../components/Loading";
import { Problem, ProblemProps } from "../components/Problem";
import { AuthContext } from "../contexts/auth";

import { api } from "../services/api";

export function Home() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [problems, setProblems] = useState<ProblemProps[]>([]);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleOpenDetails = (problemId: string) => {
    navigation.navigate("details", { problemId });
  };

  const handleNewProblem = () => {
    navigation.navigate("select_map_position");
  };

  const handleUserProfile = () => {
    return navigation.navigate("profile_user");
  };

  useEffect(() => {
    setLoading(true);
    console.log("home: ", user);
    api
      .get<ProblemProps[]>(`/problems/user/${user.id}/${statusSelected}`)
      .then((response) => {
        setProblems(response.data);
        setLoading(false);
      });
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <ButtonNativeBase onPress={handleUserProfile} variant="unstyled">
          <Image
            size={10}
            borderRadius={100}
            source={{
              uri: "https://avatars.githubusercontent.com/u/59943388?v=4",
            }}
            alt="Alternate Text"
          />
        </ButtonNativeBase>
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Minhas Solicitações </Heading>
          <Text color="gray.200">{problems.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={problems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Problem data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            ListEmptyComponent={() => (
              <Center>
                <ChatCenteredText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {"\n"}
                  solicitações{" "}
                  {statusSelected === "open" ? "em andamento" : "finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button onPress={handleNewProblem} title="Nova solicitação" />
      </VStack>
    </VStack>
  );
}
