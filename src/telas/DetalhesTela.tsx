import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhe">;

export default function DetalhesTela({ route, navigation }: Props) {
  const { name } = route.params;

  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CARREGAR DETALHES
  async function carregarDetalhes() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (!res.ok) throw new Error("Erro ao carregar detalhes");

      const data = await res.json();
      setPokemon(data);
    } catch (e) {
      setError("Erro ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDetalhes();
  }, []);

  const image =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {loading && <Text>Carregando...</Text>}

      {error && (
        <View>
          <Text style={{ color: "red" }}>{error}</Text>
          <Button title="Tentar novamente" onPress={carregarDetalhes} />
        </View>
      )}

      {!loading && pokemon && (
        <>
          <Text style={styles.title}>{pokemon.name}</Text>

          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          <Text style={styles.sectionTitle}>Tipos:</Text>
          <Text>
            {pokemon.types.map((t: any) => t.type.name).join(", ")}
          </Text>

          <Text style={styles.sectionTitle}>Habilidades:</Text>
          <Text>
            {pokemon.abilities
              .map((a: any) => a.ability.name)
              .join(", ")}
          </Text>

          <Text style={styles.sectionTitle}>Stats:</Text>
          {pokemon.stats.map((s: any) => (
            <Text key={s.stat.name}>
              {s.stat.name}: {s.base_stat}
            </Text>
          ))}

          <View style={{ marginTop: 20 }}>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginBottom: 12,
  },

  image: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 18,
  },
});
