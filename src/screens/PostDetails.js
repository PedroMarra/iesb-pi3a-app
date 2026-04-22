// src/screens/PostDetails.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';

// Dados fakes para simular o post detalhado
const postData = {
  user: 'Pedro Braga',
  time: '2 horas atrás',
  title: 'Dúvida cruel em PI3A',
  content: 'Galera, alguém conseguiu conectar o backend Node com o Expo no Windows? Já tentei de tudo e continuo pegando erro de Network Request Failed. Socorro!',
  likes: 15,
};

export default function PostDetails() {
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Cabeçalho do Post */}
        <View style={styles.postHeader}>
          <Image style={styles.avatar} source={{ uri: 'https://i.pravatar.cc/150?u=pedro' }} />
          <View>
            <Text style={styles.userName}>{postData.user}</Text>
            <Text style={styles.timeText}>{postData.time}</Text>
          </View>
        </View>

        {/* Conteúdo do Post */}
        <Text style={styles.postTitle}>{postData.title}</Text>
        <Text style={styles.postContent}>{postData.content}</Text>

        {/* Botão Curtir */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.likeText}>❤️ {postData.likes} Curtidas</Text>
          </TouchableOpacity>
        </View>

        {/* Área de Comentários */}
        <Text style={styles.commentHeader}>Comentários (2)</Text>
        
        <View style={styles.commentCard}>
          <Image style={styles.avatarSmall} source={{ uri: 'https://i.pravatar.cc/150?u=maria' }} />
          <View style={styles.commentContent}>
            <Text style={styles.commentUser}>Maria Souza</Text>
            <Text style={styles.commentText}>Verificou se o IP no fetch está correto? Não use localhost!</Text>
          </View>
        </View>
      </ScrollView>

      {/* Barra de Input Fofa (Print 3) */}
      <View style={styles.inputBar}>
        <TextInput style={styles.input} placeholder="Escreva um comentário..." />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userName: { fontWeight: 'bold', color: COLORS.text, fontSize: 16 },
  timeText: { color: COLORS.subtitle, fontSize: 12 },
  postTitle: { fontWeight: 'bold', color: COLORS.text, fontSize: 20, marginBottom: 10 },
  postContent: { color: COLORS.text, fontSize: 16, lineHeight: 22, marginBottom: 15 },
  actionRow: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border, paddingVertical: 10, marginBottom: 15 },
  likeButton: { flexDirection: 'row', alignItems: 'center' },
  likeText: { color: COLORS.primary, fontWeight: 'bold' },
  commentHeader: { fontWeight: 'bold', color: COLORS.text, fontSize: 18, marginBottom: 15 },
  commentCard: { flexDirection: 'row', marginBottom: 15, backgroundColor: COLORS.card, padding: 10, borderRadius: 8 },
  avatarSmall: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  commentContent: { flex: 1 },
  commentUser: { fontWeight: 'bold', color: COLORS.text },
  commentText: { color: COLORS.subtitle },
  inputBar: { flexDirection: 'row', padding: 10, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'center' },
  input: { flex: 1, backgroundColor: COLORS.background, padding: 10, borderRadius: 20, marginRight: 10 },
  sendText: { color: COLORS.primary, fontWeight: 'bold' },
});