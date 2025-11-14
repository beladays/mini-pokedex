import React, { useEffect, useState } from "react";
import {View, Text, TextInput, Button, FlatList,ActivityIndicator,StyleSheet,} from "react-native";
import PokemonItem from "../componentes/PokemonItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export default function ListaScreen({ navigation }: Props) {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");

 
  // CARREGAR A LISTA

  async function loadPage(limit = 20, newOffset = 0) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${newOffset}`
      );

      if (!res.ok) throw new Error("Erro ao buscar lista");

      const data = await res.json();
      setPokemonList(data.results); // lista de { name, url }
    } catch (e) {
      setError("Erro ao carregar lista. Tentar novamente?");
    } finally {
      setLoading(false);
    }
  }

  // carregar primeira página
  useEffect(() => {
    loadPage(20, 0);
  }, []);

 
  // busca por NOME

  async function searchByName() {
    const query = search.trim().toLowerCase();
    if (!query) {
      setOffset(0);
      loadPage(20, 0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
      );

      if (res.status === 404) {
        setError("Pokémon não encontrado");
        return;
      }

      if (!res.ok) throw new Error("Erro ao buscar Pokémon");

      const data = await res.json();

      navigation.navigate("Detalhe", { name: data.name });
    } catch (e) {
      setError("Erro na busca. Tentar novamente?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      
      {/* CAMPO DE BUSCA */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome..."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Buscar" onPress={searchByName} />
      </View>

      {/* negocinho de carregameno*/}
      {loading && <ActivityIndicator size="large" />}
      {loading && <Text>Carregando...</Text>}

      {/* ERRO */}
      {error && (
        <View>
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          <Button
            title="Tentar novamente"
            onPress={() => loadPage(20, offset)}
          />
        </View>
      )}

      {/* LISTA */}
      {!loading && !error && (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PokemonItem
              name={item.name}
              onPress={() =>
                navigation.navigate("Detalhe", { name: item.name })
              }
            />
          )}
        />
      )}

      {/* PAGINAÇÃO */}
      <View style={styles.pagination}>
        <Button
          title="Anterior"
          onPress={() => {
            const newOffset = Math.max(offset - 20, 0);
            setOffset(newOffset);
            loadPage(20, newOffset);
          }}
        />
        <Button
          title="Próxima"
          onPress={() => {
            const newOffset = offset + 20;
            setOffset(newOffset);
            loadPage(20, newOffset);
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 20,
    backgroundColor: "#fff",
  },

  searchRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
