import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { Door, NotePencil } from "phosphor-react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function ProfileUser() {
  const { colors } = useTheme();
  return (
    <VStack flex={1} bg="gray.600" alignItems="center">
      <Box bg="gray.600" px={6}>
        <Header title="Meu Perfil" />
      </Box>
      <ScrollView flex={1} w="full">
        <VStack w="full" alignItems="center">
          <HStack
            bg="gray.700"
            w="full"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            pt={9}
            pb={20}
            px={6}
          >
            <Image
              size={150}
              borderRadius={100}
              source={{
                uri: "https://avatars.githubusercontent.com/u/59943388?v=4",
              }}
              alt="Alternate Text"
            />
            <Heading pt={6} color="gray.100">
              Rodrigo Lucas
            </Heading>
          </HStack>
          <VStack
            alignItems="center"
            w={350}
            borderRadius={10}
            mt={-10}
            flex={1}
            bg="gray.500"
          >
            <Text fontSize={20} lineHeight={30} pt={6} color="gray.100">
              Meus dados
            </Text>
            <VStack mt={2} mb={2} bg="gray.100" h={0.2} w={300} />

            <VStack pb={20}>
              <Text fontSize={18} lineHeight={30} pt={6} color="gray.100">
                Nome
              </Text>
              <Input
                w={300}
                placeholder="Rodrigo Lucas"
                value="Rodrigo Lucas"
                isDisabled={true}
              />

              <Text fontSize={18} lineHeight={30} pt={3} color="gray.100">
                E-mail
              </Text>
              <Input
                w={300}
                placeholder="Rodrigo Lucas"
                value="Rodrigo@gmail.com"
                isDisabled={true}
              />
            </VStack>
          </VStack>

          <Button
            w={350}
            bg="primary.700"
            _pressed={{
              bg: "primary.600",
            }}
            title="Editar meus dados"
            m={5}
            leftIcon={<Icon as={<NotePencil color={colors.gray[100]} />} />}
          />

          <Button
            w={350}
            bg="secondary.700"
            _pressed={{
              bg: "secondary.600",
            }}
            title="Sair"
            m={5}
            leftIcon={<Icon as={<Door color={colors.gray[100]} />} />}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}