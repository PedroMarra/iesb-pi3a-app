// src/components/PostCard.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

// Formata a data relativa ("2 horas atrás", "3 dias atrás")
export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // segundos

  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
  return date.toLocaleDateString('pt-BR');
}

// Badge de categoria
function CategoryBadge({ category }) {
  const colors = {
    Dúvidas: '#6C5CE7',
    Suporte: '#E17055',
    Ferramentas: '#00B894',
    Geral: '#636E72',
  };
  const color = colors[category] || colors.Geral;
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{category}</Text>
    </View>
  );
}

export default function PostCard({ post, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: post.userAvatar }} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.time}>{formatRelativeTime(post.createdAt)}</Text>
        </View>
        {post.category && <CategoryBadge category={post.category} />}
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      <View style={styles.footer}>
        <Text style={styles.stat}>❤️ {post.likes}</Text>
        <Text style={styles.stat}>💬 {post.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  headerInfo: { flex: 1 },
  userName: { fontWeight: '700', color: COLORS.text, fontSize: 14 },
  time: { color: COLORS.subtitle, fontSize: 11, marginTop: 1 },
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  title: {
    fontWeight: '700',
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 5,
  },
  content: {
    color: COLORS.subtitle,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 16,
  },
  stat: {
    color: COLORS.subtitle,
    fontSize: 13,
    fontWeight: '600',
  },
});
