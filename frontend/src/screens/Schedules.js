// src/screens/Schedules.js
import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity,
  Modal, ActivityIndicator, Alert, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../services/api';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';

const SHIFTS = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];
const SHIFT_LABELS = { MATUTINO: '🌅 Matutino', VESPERTINO: '☀️ Vespertino', NOTURNO: '🌙 Noturno' };
const SHIFT_COLORS = { MATUTINO: '#F59E0B', VESPERTINO: COLORS.primary, NOTURNO: '#6C5CE7' };

const EMPTY_FORM = { subject: '', startTime: '', endTime: '', room: '', shift: '' };

export default function Schedules({ navigation }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar os horários. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSchedules();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchSchedules);
    return unsubscribe;
  }, [navigation, fetchSchedules]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalVisible(true);
  }

  function openEdit(item) {
    setForm({
      subject: item.subject,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
      shift: item.shift,
    });
    setEditingId(item.id);
    setModalVisible(true);
  }

  function validate() {
    if (!form.subject.trim()) { Alert.alert('Campo obrigatório', 'A disciplina não pode estar vazia.'); return false; }
    if (!form.startTime.trim()) { Alert.alert('Campo obrigatório', 'Informe o horário de início.'); return false; }
    if (!form.endTime.trim()) { Alert.alert('Campo obrigatório', 'Informe o horário de término.'); return false; }
    if (!form.room.trim()) { Alert.alert('Campo obrigatório', 'Informe a sala.'); return false; }
    if (!form.shift) { Alert.alert('Campo obrigatório', 'Selecione o turno.'); return false; }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateSchedule(editingId, form);
      } else {
        await createSchedule(form);
      }
      setModalVisible(false);
      fetchSchedules();
    } catch (err) {
      const msg = err.response?.data?.error || 'Falha na conexão. Verifique se a API está rodando.';
      Alert.alert('Erro ao salvar', msg);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id) {
    Alert.alert(
      'Excluir horário',
      'Tem certeza que deseja apagar este horário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSchedule(id);
              fetchSchedules();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível apagar o horário.');
            }
          },
        },
      ]
    );
  }

  if (loading) return <LoadingOverlay message="Carregando horários..." />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate} activeOpacity={0.85}>
        <Text style={styles.addButtonText}>+ Novo Horário</Text>
      </TouchableOpacity>

      <FlatList
        data={schedules}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="📅"
            title="Nenhum horário cadastrado"
            subtitle="Toque em '+ Novo Horário' para adicionar sua primeira aula."
          />
        }
        renderItem={({ item }) => {
          const shiftColor = SHIFT_COLORS[item.shift] || COLORS.primary;
          return (
            <View style={[styles.card, { borderLeftColor: shiftColor }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardSubject}>{item.subject}</Text>
                <View style={[styles.shiftBadge, { backgroundColor: shiftColor + '22', borderColor: shiftColor }]}>
                  <Text style={[styles.shiftText, { color: shiftColor }]}>{SHIFT_LABELS[item.shift]}</Text>
                </View>
              </View>
              <Text style={styles.cardInfo}>🕐 {item.startTime} – {item.endTime}   📍 {item.room}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                  <Text style={styles.editBtnText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtnText}>🗑️ Apagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Horário' : 'Novo Horário'}</Text>

              <Text style={styles.label}>Disciplina *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Cálculo 1"
                placeholderTextColor={COLORS.subtitle}
                value={form.subject}
                onChangeText={(v) => setForm({ ...form, subject: v })}
              />

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>Início *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="08:00"
                    placeholderTextColor={COLORS.subtitle}
                    value={form.startTime}
                    onChangeText={(v) => setForm({ ...form, startTime: v })}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>Término *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="09:50"
                    placeholderTextColor={COLORS.subtitle}
                    value={form.endTime}
                    onChangeText={(v) => setForm({ ...form, endTime: v })}
                  />
                </View>
              </View>

              <Text style={styles.label}>Sala *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Bloco J - JB1"
                placeholderTextColor={COLORS.subtitle}
                value={form.room}
                onChangeText={(v) => setForm({ ...form, room: v })}
              />

              <Text style={styles.label}>Turno *</Text>
              <View style={styles.shiftRow}>
                {SHIFTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.shiftOption, form.shift === s && styles.shiftOptionActive]}
                    onPress={() => setForm({ ...form, shift: s })}
                  >
                    <Text style={[styles.shiftOptionText, form.shift === s && styles.shiftOptionTextActive]}>
                      {SHIFT_LABELS[s]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={saving}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color={COLORS.secondary} />
                    : <Text style={styles.saveBtnText}>{editingId ? 'Salvar' : 'Adicionar'}</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 15 },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  addButtonText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 16 },
  list: { paddingBottom: 24, flexGrow: 1 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 6 },
  cardSubject: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1 },
  shiftBadge: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  shiftText: { fontSize: 11, fontWeight: '700' },
  cardInfo: { color: COLORS.subtitle, fontSize: 13, marginBottom: 14 },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  editBtnText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  deleteBtn: { flex: 1, backgroundColor: COLORS.lightRed, borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  deleteBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '92%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.subtitle, marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, marginBottom: 14 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  shiftRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  shiftOption: { flex: 1, minWidth: 90, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.background },
  shiftOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.lightRed },
  shiftOptionText: { color: COLORS.subtitle, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  shiftOptionTextActive: { color: COLORS.primary },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 10 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.subtitle, fontWeight: '700' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnText: { color: COLORS.secondary, fontWeight: '700' },
});
