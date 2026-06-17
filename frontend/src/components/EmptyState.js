// src/components/EmptyState.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export default function EmptyState({ icon = '🔍', title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: { fontSize: 52, marginBottom: 16 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    textAlign: 'center',
    lineHeight: 20,
  },
});
