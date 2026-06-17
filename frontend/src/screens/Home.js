// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getUserById, CURRENT_USER_ID } from '../services/api';

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getUserById(CURRENT_USER_ID);
      setUser(res.data);
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar os dados do usuário. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 1, title: 'Fórum', icon: '💬', screen: 'Forum' },
    { id: 2, title: 'Notas', icon: '📝', screen: 'Grades' },
    { id: 3, title: 'Horários', icon: '🕒', screen: 'Schedules' },
    { id: 4, title: 'Vale Refeição', icon: '🎫', screen: null },
    { id: 5, title: 'Mapa do IESB', icon: '🗺️', screen: null },
  ];

  const handleMenuPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Em breve!', `A funcionalidade "${item.title}" estará disponível na próxima versão.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Saudação */}
      <View style={styles.welcomeCard}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <>
            <Text style={styles.welcomeGreeting}>Olá,</Text>
            <Text style={styles.welcomeName}>{user?.name ?? 'Aluno'} 👋</Text>
            <Text style={styles.welcomeSub}>{user?.curso}</Text>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>

      <View style={styles.grid}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>{item.icon}</Text>
            <Text style={styles.gridText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Banner do Fórum */}
      <TouchableOpacity
        style={styles.banner}
        onPress={() => navigation.navigate('Forum')}
        activeOpacity={0.85}
      >
        <View>
          <Text style={styles.bannerTitle}>💬 Fórum da Comunidade</Text>
          <Text style={styles.bannerSub}>Tire dúvidas e ajude outros alunos</Text>
        </View>
        <Text style={styles.bannerArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  welcomeCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    marginBottom: 20,
  },
  welcomeGreeting: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  welcomeName: { color: COLORS.secondary, fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  welcomeSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: COLORS.card,
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  gridIcon: { fontSize: 38, marginBottom: 10 },
  gridText: { color: COLORS.text, fontWeight: '600', textAlign: 'center', fontSize: 14 },
  banner: {
    marginHorizontal: 15,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  bannerTitle: { fontWeight: '700', color: COLORS.text, fontSize: 16 },
  bannerSub: { color: COLORS.subtitle, fontSize: 13, marginTop: 2 },
  bannerArrow: { fontSize: 22, color: COLORS.primary, fontWeight: 'bold' },
});
