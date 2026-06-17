// src/screens/Forum.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['Todos', 'Dúvidas', 'Suporte', 'Ferramentas', 'Geral'];

export default function Forum({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const fetchPosts = useCallback(async (searchTerm = '', category = 'Todos') => {
    try {
      const res = await getPosts(searchTerm, category);
      setPosts(res.data);
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar o fórum. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(search, activeCategory);
  }, [activeCategory]);

  // Atualiza ao voltar para a tela (ex: após criar post)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts(search, activeCategory);
    });
    return unsubscribe;
  }, [navigation, search, activeCategory]);

  const onSearch = () => fetchPosts(search, activeCategory);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(search, activeCategory);
  };

  const handleCategoryPress = (cat) => {
    setActiveCategory(cat);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={40} color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando fórum...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar no fórum..."
            placeholderTextColor={COLORS.subtitle}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro de categorias */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.catList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Lista de posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="💬"
            title="Nenhuma publicação encontrada"
            subtitle={search ? `Sem resultados para "${search}"` : 'Seja o primeiro a postar!'}
          />
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 12, color: COLORS.subtitle },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { fontSize: 15, color: COLORS.text },
  searchBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    padding: 10,
  },
  searchBtnText: { fontSize: 16 },
  catList: { paddingHorizontal: 15, paddingBottom: 10, gap: 8 },
  catChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { color: COLORS.subtitle, fontWeight: '600', fontSize: 13 },
  catTextActive: { color: COLORS.secondary },
  list: { paddingHorizontal: 15, paddingBottom: 20, flexGrow: 1 },
});
