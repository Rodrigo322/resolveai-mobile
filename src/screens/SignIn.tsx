import { useNavigation } from "@react-navigation/native";
import { Heading, Icon, Text, useTheme, VStack } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useContext, useState } from "react";

import Logo from "../assets/1.svg";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { AuthContext } from "../contexts/auth";

export function SignIn() {
  const { signIn } = useContext(AuthContext);
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate("signOut");
  }

  async function handleSignIn() {
    const data = {
      email,
      password,
    };
    await signIn(data);
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        autoCapitalize="none"
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon ml={4} as={<Envelope color={colors.gray[300]} />} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon ml={4} as={<Key color={colors.gray[300]} />} />}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        onPress={handleSignIn}
        isLoading={isLoading}
        title="Entrar"
        w="full"
      />
      <Text color="gray.100" fontSize="sm" mt={20} mb={6}>
        Ainda não possui conta?
      </Text>
      <Button
        onPress={handleSignOut}
        _pressed={{
          bg: "primary.600",
        }}
        title="Criar conta"
        bg="primary.700"
        w="full"
      />
    </VStack>
  );
}
