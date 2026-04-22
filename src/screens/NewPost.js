// src/screens/NewPost.js
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function NewPost() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.inputTitle} placeholder="Título da publicação" placeholderTextColor={COLORS.subtitle} />
      <TextInput 
        style={styles.inputContent} 
        placeholder="Escreva o que você está pensando..." 
        placeholderTextColor={COLORS.subtitle}
        multiline 
        numberOfLines={10} 
      />
      
      <TouchableOpacity style={styles.imageButton}>
        <Text style={styles.imageButtonText}>📷 Adicionar Imagem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.publishButton}>
        <Text style={styles.publishButtonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  inputTitle: { backgroundColor: COLORS.card, padding: 15, borderRadius: 10, fontSize: 18, fontWeight: 'bold', marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text },
  inputContent: { backgroundColor: COLORS.card, padding: 15, borderRadius: 10, fontSize: 16, textAlignVertical: 'top', marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text },
  imageButton: { backgroundColor: COLORS.border, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  imageButtonText: { color: COLORS.text, fontWeight: '600' },
  publishButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  publishButtonText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 18 },
});