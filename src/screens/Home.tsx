import {
  Center,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { ChatCenteredText, SignOut } from "phosphor-react-native";
import { useEffect, useState } from "react";

import Logo from "../assets/logo_secondary.svg";

import { Filter } from "../components/Filter";
import { Problem, ProblemProps } from "../components/Problem";

import { api } from "../services/api";

export function Home() {
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [problems, setProblems] = useState<ProblemProps[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    api.get<ProblemProps[]>("/problems").then((response) => {
      const data = response.data.map((item) => item);
      setProblems(data);
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
        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Minhas Solicitações</Heading>
          <Text color="gray.200">3</Text>
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

        <FlatList
          data={problems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Problem data={item} />}
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
      </VStack>
    </VStack>
  );
}
