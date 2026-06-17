// src/screens/PostDetails.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  TouchableOpacity, TextInput, Alert, ActivityIndicator,
  FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getPostById, likePost, addComment, deletePost, CURRENT_USER_ID } from '../services/api';
import { formatRelativeTime } from '../components/PostCard';
import LoadingOverlay from '../components/LoadingOverlay';

export default function PostDetails({ route, navigation }) {
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await getPostById(postId);
      setPost(res.data);
      setLiked(res.data.likedBy?.includes(CURRENT_USER_ID));
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar o post.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    // Otimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setPost(p => ({ ...p, likes: wasLiked ? p.likes - 1 : p.likes + 1 }));
    try {
      await likePost(postId, CURRENT_USER_ID);
    } catch (err) {
      // Reverte se falhar
      setLiked(wasLiked);
      setPost(p => ({ ...p, likes: wasLiked ? p.likes + 1 : p.likes - 1 }));
      Alert.alert('Erro', 'Não foi possível registrar a curtida.');
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Atenção', 'O comentário não pode estar vazio.');
      return;
    }
    setSendingComment(true);
    try {
      const res = await addComment(postId, CURRENT_USER_ID, commentText.trim());
      setPost(p => ({
        ...p,
        comments: [...(p.comments || []), res.data],
        commentCount: (p.commentCount || 0) + 1,
      }));
      setCommentText('');
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível enviar o comentário.');
    } finally {
      setSendingComment(false);
    }
  };

  const handleDelete = () => {
    if (!post || post.userId !== CURRENT_USER_ID) return;
    Alert.alert(
      'Excluir publicação',
      'Tem certeza que deseja excluir esta publicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId, CURRENT_USER_ID);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o post.');
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingOverlay message="Carregando publicação..." />;
  if (!post) return null;

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho do post */}
        <View style={styles.postHeader}>
          <Image style={styles.avatar} source={{ uri: post.userAvatar }} />
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.timeText}>{formatRelativeTime(post.createdAt)}</Text>
          </View>
          {post.userId === CURRENT_USER_ID && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Conteúdo */}
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Ações */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.likeBtn, liked && styles.likeBtnActive]} onPress={handleLike}>
            <Text style={styles.likeBtnText}>{liked ? '❤️' : '🤍'} {post.likes} Curtidas</Text>
          </TouchableOpacity>
          <View style={styles.commentCount}>
            <Text style={styles.commentCountText}>💬 {post.commentCount}</Text>
          </View>
        </View>

        {/* Comentários */}
        <Text style={styles.commentHeader}>
          Comentários ({post.comments?.length ?? 0})
        </Text>

        {(post.comments || []).map(c => (
          <View key={c.id} style={styles.commentCard}>
            <Image style={styles.avatarSmall} source={{ uri: c.userAvatar }} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{c.userName}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.commentTime}>{formatRelativeTime(c.createdAt)}</Text>
            </View>
          </View>
        ))}

        {(post.comments || []).length === 0 && (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>Seja o primeiro a comentar! 💬</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Barra de comentário */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentário..."
          placeholderTextColor={COLORS.subtitle}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, sendingComment && styles.sendButtonDisabled]}
          onPress={handleSendComment}
          disabled={sendingComment}
        >
          {sendingComment
            ? <ActivityIndicator size="small" color={COLORS.secondary} />
            : <Text style={styles.sendText}>Enviar</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  headerInfo: { flex: 1 },
  userName: { fontWeight: '700', color: COLORS.text, fontSize: 16 },
  timeText: { color: COLORS.subtitle, fontSize: 12, marginTop: 2 },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 20 },
  postTitle: { fontWeight: '700', color: COLORS.text, fontSize: 20, marginBottom: 10, lineHeight: 26 },
  postContent: { color: COLORS.text, fontSize: 16, lineHeight: 24, marginBottom: 18 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  likeBtnActive: {
    backgroundColor: '#FFF0F0',
    borderColor: COLORS.primary,
  },
  likeBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  commentCount: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  commentCountText: { color: COLORS.subtitle, fontWeight: '600', fontSize: 14 },
  commentHeader: { fontWeight: '700', color: COLORS.text, fontSize: 18, marginBottom: 12 },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    elevation: 1,
  },
  avatarSmall: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  commentContent: { flex: 1 },
  commentUser: { fontWeight: '700', color: COLORS.text, fontSize: 13, marginBottom: 3 },
  commentText: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  commentTime: { color: COLORS.subtitle, fontSize: 11, marginTop: 4 },
  noComments: { alignItems: 'center', paddingVertical: 20 },
  noCommentsText: { color: COLORS.subtitle, fontSize: 14 },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: COLORS.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: { opacity: 0.6 },
  sendText: { color: COLORS.secondary, fontWeight: '700', fontSize: 14 },
});
