// src/screens/Profile.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView, FlatList, Alert, ActivityIndicator,
  TextInput, Modal, RefreshControl,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getUserById, getUserPosts, updateUser, CURRENT_USER_ID } from '../services/api';
import { formatRelativeTime } from '../components/PostCard';
import LoadingOverlay from '../components/LoadingOverlay';
import EmptyState from '../components/EmptyState';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCurso, setEditCurso] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, postsRes] = await Promise.all([
        getUserById(CURRENT_USER_ID),
        getUserPosts(CURRENT_USER_ID),
      ]);
      setUser(userRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditCurso(user?.curso || '');
    setEditModal(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode estar vazio.');
      return;
    }
    setSaving(true);
    try {
      const res = await updateUser(CURRENT_USER_ID, { name: editName, curso: editCurso });
      setUser(res.data);
      setEditModal(false);
      Alert.alert('Perfil atualizado! ✅', 'Suas informações foram salvas.');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingOverlay message="Carregando perfil..." />;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[COLORS.primary]} />}
    >
      {/* Cabeçalho do perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.profileAvatar} source={{ uri: user?.avatar }} />
        </View>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileId}>Matrícula: {user?.matricula}</Text>
        <Text style={styles.profileCurso}>{user?.curso}</Text>
        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
          <Text style={styles.editButtonText}>✏️  Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Postagens</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.reduce((acc, p) => acc + p.likes, 0)}</Text>
          <Text style={styles.statLabel}>Curtidas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.reduce((acc, p) => acc + (p.commentCount || 0), 0)}</Text>
          <Text style={styles.statLabel}>Comentários</Text>
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Minhas Postagens
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Guardados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo das abas */}
      <View style={styles.tabContent}>
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <EmptyState icon="📝" title="Nenhuma postagem" subtitle="Você ainda não publicou nada." />
          ) : (
            posts.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.miniPostCard}
                onPress={() => navigation.navigate('PostDetails', { postId: p.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.miniPostTitle} numberOfLines={2}>{p.title}</Text>
                <Text style={styles.miniPostContent} numberOfLines={2}>{p.content}</Text>
                <View style={styles.miniPostFooter}>
                  <Text style={styles.miniPostStat}>❤️ {p.likes}  💬 {p.commentCount || 0}</Text>
                  <Text style={styles.miniPostTime}>{formatRelativeTime(p.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : (
          <EmptyState icon="🔖" title="Sem itens guardados" subtitle="Esta funcionalidade estará disponível em breve." />
        )}
      </View>

      {/* Modal de edição */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome completo"
              placeholderTextColor={COLORS.subtitle}
              maxLength={60}
            />

            <Text style={styles.modalLabel}>Curso</Text>
            <TextInput
              style={styles.modalInput}
              value={editCurso}
              onChangeText={setEditCurso}
              placeholder="Seu curso"
              placeholderTextColor={COLORS.subtitle}
              maxLength={80}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color={COLORS.secondary} />
                  : <Text style={styles.modalSaveText}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarWrapper: {
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 2,
    marginBottom: 14,
  },
  profileAvatar: { width: 96, height: 96, borderRadius: 48 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  profileId: { color: COLORS.subtitle, fontSize: 13, marginTop: 2 },
  profileCurso: { color: COLORS.subtitle, fontSize: 13, marginTop: 2, marginBottom: 14 },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  editButtonText: { color: COLORS.secondary, fontWeight: '700', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.subtitle, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.subtitle, fontWeight: '600', fontSize: 14 },
  activeTabText: { color: COLORS.primary },
  tabContent: { padding: 15 },
  miniPostCard: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  miniPostTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  miniPostContent: { color: COLORS.subtitle, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  miniPostFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniPostStat: { color: COLORS.subtitle, fontSize: 12 },
  miniPostTime: { color: COLORS.subtitle, fontSize: 11 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 12, fontWeight: '700', color: COLORS.subtitle, marginBottom: 6, textTransform: 'uppercase' },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 14,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  modalCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: { color: COLORS.subtitle, fontWeight: '700' },
  modalSaveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalSaveText: { color: COLORS.secondary, fontWeight: '700' },
});
