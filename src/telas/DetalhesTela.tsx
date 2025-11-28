import React, { useEffect, useRef, useState } from "react";
import {View,Text,Image,ActivityIndicator,Button,StyleSheet,} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhe">;

const TIMEOUT = 8000;
const MAX_RETRIES = 3;

export default function DetalhesTela({ route, navigation }: Props) {
  const { name } = route.params;

  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  async function fetchWithRetry(url: string, attempt = 1): Promise<any> {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        if (attempt < MAX_RETRIES && response.status >= 500) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * attempt)
          );
          return fetchWithRetry(url, attempt + 1);
        }
        throw new Error("Erro HTTP");
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function carregarDetalhes() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );

      setPokemon(data);
    } catch {
      setError("Erro ao carregar detalhes do Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDetalhes();
    return () => controllerRef.current?.abort();
  }, []);

  const image =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}

      {error && (
        <>
          <Text style={styles.error}>{error}</Text>
          <Button title="Tentar novamente" onPress={carregarDetalhes} />
        </>
      )}

      {pokemon && !loading && (
        <>
          <Text style={styles.title}>{pokemon.name}</Text>
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Text style={styles.section}>Tipos:</Text>
          <Text>{pokemon.types.map((t: any) => t.type.name).join(", ")}</Text>

          <Text style={styles.section}>Habilidades:</Text>
          <Text>{pokemon.abilities.map((a: any) => a.ability.name).join(", ")}</Text>

          <Text style={styles.section}>Stats:</Text>
          {pokemon.stats.map((s: any) => (
            <Text key={s.stat.name}>
              {s.stat.name}: {s.base_stat}
            </Text>
          ))}

          <Button title="Voltar" onPress={() => navigation.goBack()} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: "center",
  },
  section: {
    marginTop: 12,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
