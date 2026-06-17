// src/components/LoadingOverlay.js
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export default function LoadingOverlay({ message = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={40} color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 12,
    color: COLORS.subtitle,
    fontSize: 14,
  },
});
