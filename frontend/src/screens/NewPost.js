// src/screens/NewPost.js
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { createPost, CURRENT_USER_ID } from '../services/api';

const CATEGORIES = ['Dúvidas', 'Suporte', 'Ferramentas', 'Geral'];

export default function NewPost({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    // Validações
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'O título não pode estar vazio.');
      return;
    }
    if (title.trim().length < 5) {
      Alert.alert('Título muito curto', 'O título deve ter pelo menos 5 caracteres.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Campo obrigatório', 'O conteúdo não pode estar vazio.');
      return;
    }
    if (content.trim().length < 10) {
      Alert.alert('Conteúdo muito curto', 'Escreva pelo menos 10 caracteres no conteúdo.');
      return;
    }

    setLoading(true);
    try {
      await createPost({
        userId: CURRENT_USER_ID,
        title: title.trim(),
        content: content.trim(),
        category,
      });
      Alert.alert('Publicado! 🎉', 'Sua publicação foi criada com sucesso.', [
        {
          text: 'Ver Fórum',
          onPress: () => {
            setTitle('');
            setContent('');
            setCategory('Geral');
            navigation.navigate('Forum');
          },
        },
      ]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Falha na conexão. Verifique se a API está rodando.';
      Alert.alert('Erro ao publicar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.inputTitle}
          placeholder="Qual é o assunto?"
          placeholderTextColor={COLORS.subtitle}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <Text style={styles.charCount}>{title.length}/100</Text>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Conteúdo *</Text>
        <TextInput
          style={styles.inputContent}
          placeholder="Escreva o que você está pensando..."
          placeholderTextColor={COLORS.subtitle}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          maxLength={2000}
        />
        <Text style={styles.charCount}>{content.length}/2000</Text>

        <TouchableOpacity
          style={[styles.publishButton, loading && styles.publishButtonDisabled]}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.secondary} />
            : <Text style={styles.publishButtonText}>Publicar</Text>
          }
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.subtitle, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputTitle: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    fontSize: 17,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  charCount: {
    textAlign: 'right',
    color: COLORS.subtitle,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 16,
  },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { color: COLORS.subtitle, fontWeight: '600', fontSize: 13 },
  catTextActive: { color: COLORS.secondary },
  inputContent: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    minHeight: 160,
  },
  publishButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  publishButtonDisabled: { opacity: 0.7 },
  publishButtonText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 17 },
});
