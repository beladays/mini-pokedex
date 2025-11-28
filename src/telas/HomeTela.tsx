import React, { useEffect, useRef, useState } from "react";
import {View,Text,TextInput,Button,FlatList,ActivityIndicator,StyleSheet,TouchableOpacity,} from "react-native";
import PokemonItem from "../componentes/PokemonItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">; //ts sabe qual tela usa

const LIMIT = 20;
const TIMEOUT = 8000;
const MAX_RETRIES = 3; //

const TYPES = [
  "all","fire","water","grass","electric","bug","normal","poison",
  "ground","fairy","fighting","psychic","rock","ghost","ice","dragon"
];

export default function ListaScreen({ navigation }: Props) {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showTypes, setShowTypes] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);


  async function fetchWithRetry(url: string, attempt = 1): Promise<any> {
    controllerRef.current?.abort(); //Se existe uma requisição antiga rodand acaba 
    const controller = new AbortController(); //cancelar req
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
        throw new Error();
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function loadPokemons() {
    if (loading || selectedType !== "all") return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
      );

      setPokemonList(prev => [...prev, ...data.results]);
      setOffset(prev => prev + LIMIT);
    } catch {
      setError("Erro ao carregar lista.");
    } finally {
      setLoading(false);
    }
  }

  async function loadByType(type: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchWithRetry(
        `https://pokeapi.co/api/v2/type/${type}`
      );

      const pokemons = data.pokemon.map((p: any) => p.pokemon);
      setPokemonList(pokemons);
    } catch {
      setError("Erro ao filtrar por tipo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPokemons();
  }, []);

  function handleTypeSelect(type: string) {
    setSelectedType(type);
    setShowTypes(false);
    setPokemonList([]);
    setOffset(0);

    if (type === "all") {
      loadPokemons();
    } else {
      loadByType(type);
    }
  }

  function handleSearch(text: string) {
    setSearch(text);

    if (debounceRef.current) clearTimeout(debounceRef.current); //p n ficar fazendo req a cada letra

    debounceRef.current = setTimeout(async () => {
      if (!text.trim()) {
        setPokemonList([]);
        setOffset(0);
        loadPokemons();
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithRetry(
          `https://pokeapi.co/api/v2/pokemon/${text.toLowerCase()}`
        );

        navigation.navigate("Detalhe", { name: data.name });
      } catch {
        setError("Pokémon não encontrado.");
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon..."
        value={search}
        onChangeText={handleSearch}
      />

      {/* BOTÃO FILTRO POR TIPO */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowTypes(!showTypes)}
      >
        <Text>Tipo: {selectedType.toUpperCase()}</Text>
      </TouchableOpacity>

      {showTypes && (
        <View style={styles.typesBox}>
          {TYPES.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => handleTypeSelect(type)}
            >
              <Text style={styles.typeItem}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Button title="Tentar novamente" onPress={loadPokemons} />
        </View>
      )}

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
        onEndReached={loadPokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa",
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
    elevation: 1,
  },

  filterButton: {
    padding: 12,
    backgroundColor: "#e1e5eb",
    borderRadius: 10,
    marginBottom: 14,
    alignItems: "center",
    elevation: 1,
  },

  typesBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    elevation: 2,
  },

  typeItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    fontSize: 14,
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 15,
  },

  // Card Pokémon
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
  },

  // botão de tipo selecionado 
  typeSelected: {
    backgroundColor: "#ffe066",
  }
});
