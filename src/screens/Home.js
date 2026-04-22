// src/screens/Home.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Home() {
  const menuItems = [
    { id: 1, title: 'Fórum', icon: '💬' },
    { id: 2, title: 'Calculadora', icon: '🧮' },
    { id: 3, title: 'Notas', icon: '📝' },
    { id: 4, title: 'Vale Refeição', icon: '🎫' },
    { id: 5, title: 'Horários', icon: '🕒' },
    { id: 6, title: 'Mapa do Iesb', icon: '🗺️' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Olá, Pedro Braga!</Text>
      <View style={styles.grid}>
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.gridItem}>
            <Text style={styles.gridIcon}>{item.icon}</Text>
            <Text style={styles.gridText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { backgroundColor: COLORS.card, width: '48%', aspectRatio: 1, borderRadius: 15, padding: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3 },
  gridIcon: { fontSize: 40, marginBottom: 10 },
  gridText: { color: COLORS.text, fontWeight: '600', textAlign: 'center' },
});