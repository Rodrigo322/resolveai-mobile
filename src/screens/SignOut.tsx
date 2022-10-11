import { useNavigation } from "@react-navigation/native";
import { Heading, Icon, Text, useTheme, VStack } from "native-base";
import { Envelope, IdentificationCard, Key } from "phosphor-react-native";
import { useState } from "react";
import { Alert } from "react-native";

import Logo from "../assets/1.svg";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { api } from "../services/api";

export function SignOut() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  function handleGoBackToSignIn() {
    navigation.goBack();
  }

  async function handleSignOut() {
    setIsLoading(true);
    const data = {
      name,
      email,
      password,
    };

    if (data.name === "" || data.email === "" || data.password === "") {
      setIsLoading(false);
      return Alert.alert(
        "Alert",
        "Por favor preencha todos os campos corretamente."
      );
    }

    const response = await api.post("/user", {
      name: data.name,
      email: data.email.toLocaleLowerCase().trim(),
      password: data.password.trim(),
    });
    console.log(response);

    if (response.data.id) {
      setIsLoading(false);
      navigation.goBack();
      return Alert.alert("Success", "Usuário criado com sucesso.");
    }
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={15} mb={6}>
        Crie sua conta com seu dados
      </Heading>
      <Input
        placeholder="Nome"
        mb={4}
        InputLeftElement={
          <Icon ml={4} as={<IdentificationCard color={colors.gray[300]} />} />
        }
        onChangeText={setName}
      />
      <Input
        autoCapitalize="none"
        textTransform="lowercase"
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
        onPress={handleSignOut}
        isLoading={isLoading}
        title="Criar conta"
        w="full"
      />
      <Text color="gray.100" fontSize="sm" mt={20} mb={6}>
        Já possui conta?
      </Text>
      <Button
        onPress={handleGoBackToSignIn}
        _pressed={{
          bg: "primary.600",
        }}
        bg="primary.700"
        title="Faça login aqui"
        w="full"
      />
    </VStack>
  );
}
