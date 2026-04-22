// src/screens/Forum.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';

// Dados fakes para simular o feed
const forumPosts = [
  { id: 1, user: 'Maria Souza', userAvatar: 'https://i.pravatar.cc/150?u=maria', title: 'Calculadora de notas', content: 'Amei a nova ferramenta da calculadora!', likes: 10 },
  { id: 2, user: 'João Silva', userAvatar: 'https://i.pravatar.cc/150?u=joao', title: 'Erro no Portal', content: 'Mais alguém está com erro ao tentar...', likes: 22 },
];

export default function Forum() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Buscar dúvidas, jogos..." placeholderTextColor={COLORS.subtitle} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {forumPosts.map(post => (
          <TouchableOpacity key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image style={styles.avatar} source={{ uri: post.userAvatar }} />
              <View>
                <Text style={styles.postUser}>{post.user}</Text>
                <Text style={styles.postTitle}>{post.title}</Text>
              </View>
            </View>
            <Text style={styles.postContent} numberOfLines={2}>{post.content}</Text>
            <View style={styles.postFooter}>
              <Text style={styles.footerAction}>❤️ {post.likes} Curtidas</Text>
              <Text style={styles.footerAction}>💬 Comentar</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: COLORS.background },
  searchBar: { backgroundColor: COLORS.card, borderRadius: 25, padding: 10, marginVertical: 15, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 15 },
  searchInput: { fontSize: 16, color: COLORS.text },
  postCard: { backgroundColor: COLORS.card, borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postUser: { color: COLORS.subtitle, fontSize: 12 },
  postTitle: { fontWeight: 'bold', color: COLORS.text, fontSize: 16 },
  postContent: { color: COLORS.text, marginBottom: 10 },
  postFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  footerAction: { marginRight: 20, color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
});