// src/screens/Profile.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho do Perfil (Print 6) */}
      <View style={styles.profileHeader}>
        <Image style={styles.profileAvatar} source={{ uri: 'https://i.pravatar.cc/150?u=pedro' }} />
        <Text style={styles.profileName}>Pedro Braga</Text>
        <Text style={styles.profileId}>Matrícula: 21100001</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Abas (Print 6) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>Minhas Postagens</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Guardados</Text>
        </TouchableOpacity>
      </View>

      {/* Simulação de postagens do usuário */}
      <View style={styles.postsList}>
        <View style={styles.miniPostCard}>
          <Text style={styles.miniPostTitle}>Minha dúvida em PI3A</Text>
          <Text style={styles.miniPostStat}>❤️ 15 | 💬 2</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { alignItems: 'center', padding: 30, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  profileId: { color: COLORS.subtitle, marginBottom: 15 },
  editButton: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  editButtonText: { color: COLORS.secondary },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.card },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.subtitle, fontWeight: '600' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  postsList: { padding: 15 },
  miniPostCard: { backgroundColor: COLORS.card, padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  miniPostTitle: { color: COLORS.text, fontWeight: '600' },
  miniPostStat: { color: COLORS.subtitle, fontSize: 12, marginTop: 5 },
});