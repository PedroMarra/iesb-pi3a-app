// src/screens/Grades.js
import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity,
  Modal, ActivityIndicator, Alert, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getGrades, createGrade, updateGrade, deleteGrade } from '../services/api';
import EmptyState from '../components/EmptyState';
import LoadingOverlay from '../components/LoadingOverlay';

const EMPTY_FORM = { subject: '', p1: '', p2: '' };

const MENCAO_COLORS = {
  SS: '#6C5CE7', MS: '#00B894', MM: COLORS.primary,
  MI: '#F59E0B', II: '#D63031', SR: '#636E72',
};

// ── Cálculo Preditivo (reativo, em tempo real) ──────────────────────────
function calcMinP2(p1Str) {
  const p1 = parseFloat(p1Str);
  if (isNaN(p1)) return null;
  return Math.max(0, (5 - p1 * 0.4) / 0.6).toFixed(2);
}
function calcMedia(p1Str, p2Str) {
  const p1 = parseFloat(p1Str);
  const p2 = parseFloat(p2Str);
  if (isNaN(p1) || isNaN(p2)) return null;
  return ((p1 * 0.4) + (p2 * 0.6)).toFixed(2);
}
function getMencao(media) {
  if (media == null) return null;
  const m = parseFloat(media);
  if (m >= 9) return 'SS';
  if (m >= 7) return 'MS';
  if (m >= 5) return 'MM';
  if (m >= 3) return 'MI';
  if (m >= 0.1) return 'II';
  return 'SR';
}

export default function Grades({ navigation }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const minP2 = calcMinP2(form.p1);
  const mediaPreview = calcMedia(form.p1, form.p2);
  const mencaoPreview = getMencao(mediaPreview);
  const aprovadoPreview = mediaPreview != null ? parseFloat(mediaPreview) >= 5 : null;
  const hasP1 = form.p1.trim() !== '';
  const hasP2 = form.p2.trim() !== '';

  const fetchGrades = useCallback(async () => {
    try {
      const res = await getGrades();
      setGrades(res.data);
    } catch (err) {
      Alert.alert('Falha na conexão', 'Não foi possível carregar as notas. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchGrades(); }, []);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchGrades);
    return unsubscribe;
  }, [navigation, fetchGrades]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalVisible(true);
  }

  function openEdit(item) {
    setForm({
      subject: item.subject,
      p1: item.p1 != null ? String(item.p1) : '',
      p2: item.p2 != null ? String(item.p2) : '',
    });
    setEditingId(item.id);
    setModalVisible(true);
  }

  function validate() {
    if (!form.subject.trim()) { Alert.alert('Campo obrigatório', 'A disciplina não pode estar vazia.'); return false; }
    const p1 = parseFloat(form.p1), p2 = parseFloat(form.p2);
    if (form.p1 && (isNaN(p1) || p1 < 0 || p1 > 10)) { Alert.alert('Valor inválido', 'P1 deve ser um número entre 0 e 10.'); return false; }
    if (form.p2 && (isNaN(p2) || p2 < 0 || p2 > 10)) { Alert.alert('Valor inválido', 'P2 deve ser um número entre 0 e 10.'); return false; }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      subject: form.subject.trim(),
      p1: form.p1 !== '' ? parseFloat(form.p1) : null,
      p2: form.p2 !== '' ? parseFloat(form.p2) : null,
    };
    try {
      if (editingId) await updateGrade(editingId, payload);
      else await createGrade(payload);
      setModalVisible(false);
      fetchGrades();
    } catch (err) {
      const msg = err.response?.data?.error || 'Falha na conexão. Verifique se a API está rodando.';
      Alert.alert('Erro ao salvar', msg);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id) {
    Alert.alert(
      'Excluir nota',
      'Tem certeza que deseja apagar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try { await deleteGrade(id); fetchGrades(); }
            catch (err) { Alert.alert('Erro', 'Não foi possível apagar a nota.'); }
          },
        },
      ]
    );
  }

  if (loading) return <LoadingOverlay message="Carregando notas..." />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate} activeOpacity={0.85}>
        <Text style={styles.addButtonText}>+ Nova Nota</Text>
      </TouchableOpacity>

      <FlatList
        data={grades}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="📝"
            title="Nenhuma nota cadastrada"
            subtitle="Toque em '+ Nova Nota' para registrar sua primeira disciplina."
          />
        }
        renderItem={({ item }) => {
          const aprovadoColor = item.aprovado === true ? COLORS.success : item.aprovado === false ? COLORS.danger : COLORS.border;
          const mencaoColor = MENCAO_COLORS[item.mencao] || COLORS.subtitle;
          return (
            <View style={[styles.card, { borderLeftColor: aprovadoColor }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardSubject}>{item.subject}</Text>
                {item.mencao && (
                  <View style={[styles.mencaoBadge, { backgroundColor: mencaoColor + '22', borderColor: mencaoColor }]}>
                    <Text style={[styles.mencaoText, { color: mencaoColor }]}>{item.mencao}</Text>
                  </View>
                )}
              </View>

              <View style={styles.notasRow}>
                <View style={styles.notaBox}>
                  <Text style={styles.notaLabel}>P1 (40%)</Text>
                  <Text style={styles.notaValue}>{item.p1 != null ? item.p1.toFixed(1) : '—'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.notaBox}>
                  <Text style={styles.notaLabel}>P2 (60%)</Text>
                  <Text style={styles.notaValue}>{item.p2 != null ? item.p2.toFixed(1) : '—'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.notaBox}>
                  <Text style={styles.notaLabel}>Média</Text>
                  <Text style={[styles.notaValue, { color: aprovadoColor }]}>{item.media != null ? item.media.toFixed(2) : '—'}</Text>
                </View>
              </View>

              {item.p1 != null && item.p2 == null && (
                <View style={styles.forecastBox}>
                  <Text style={styles.forecastText}>
                    📊 Precisa de <Text style={{ fontWeight: '700', color: COLORS.text }}>{item.minP2?.toFixed(2)}</Text> na P2 para passar (MM)
                  </Text>
                </View>
              )}

              {item.aprovado != null && (
                <View style={[styles.statusBox, { backgroundColor: aprovadoColor + '15' }]}>
                  <Text style={[styles.statusText, { color: aprovadoColor }]}>
                    {item.aprovado ? '✅ Aprovado' : '❌ Reprovado'} · Menção: {item.mencao}
                  </Text>
                </View>
              )}

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
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>{editingId ? 'Editar Nota' : 'Nova Nota'}</Text>

              <Text style={styles.label}>Disciplina *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Estruturas de Dados"
                placeholderTextColor={COLORS.subtitle}
                value={form.subject}
                onChangeText={(v) => setForm({ ...form, subject: v })}
              />

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>P1 (peso 40%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0 – 10"
                    placeholderTextColor={COLORS.subtitle}
                    value={form.p1}
                    onChangeText={(v) => setForm({ ...form, p1: v })}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>P2 (peso 60%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0 – 10"
                    placeholderTextColor={COLORS.subtitle}
                    value={form.p2}
                    onChangeText={(v) => setForm({ ...form, p2: v })}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {hasP1 && !hasP2 && (
                <View style={styles.forecastModalBox}>
                  <Text style={styles.forecastModalTitle}>📊 Previsão para Aprovação (MM)</Text>
                  <Text style={styles.forecastModalDesc}>
                    Com P1 = <Text style={{ fontWeight: '700', color: COLORS.text }}>{parseFloat(form.p1).toFixed(1)}</Text>, você precisa tirar:
                  </Text>
                  <Text style={styles.forecastModalValue}>
                    {parseFloat(minP2) <= 0
                      ? '🎉 Já está aprovado! P2 ≥ 0'
                      : parseFloat(minP2) > 10
                        ? `❌ Não é mais possível atingir MM (necessário ${minP2})`
                        : `✅ Mínimo ${minP2} na P2`}
                  </Text>
                  <Text style={styles.forecastFormula}>Fórmula: (5 − P1×0.4) ÷ 0.6</Text>
                </View>
              )}

              {hasP1 && hasP2 && mediaPreview != null && (
                <View style={[styles.resultBox, { borderColor: aprovadoPreview ? COLORS.success : COLORS.danger }]}>
                  <View style={styles.resultRow}>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Média Final</Text>
                      <Text style={[styles.resultValue, { color: aprovadoPreview ? COLORS.success : COLORS.danger }]}>{mediaPreview}</Text>
                    </View>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Menção</Text>
                      <Text style={[styles.resultValue, { color: MENCAO_COLORS[mencaoPreview] || COLORS.text }]}>{mencaoPreview}</Text>
                    </View>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Situação</Text>
                      <Text style={[styles.resultValue, { color: aprovadoPreview ? COLORS.success : COLORS.danger }]}>
                        {aprovadoPreview ? 'Aprovado' : 'Reprovado'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

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
  addButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16, elevation: 2 },
  addButtonText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 16 },
  list: { paddingBottom: 24, flexGrow: 1 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 },
  cardSubject: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1 },
  mencaoBadge: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  mencaoText: { fontWeight: '800', fontSize: 13 },
  notasRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 8, padding: 10, marginBottom: 10, alignItems: 'center' },
  notaBox: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 32, backgroundColor: COLORS.border },
  notaLabel: { fontSize: 11, color: COLORS.subtitle, marginBottom: 2, textTransform: 'uppercase', fontWeight: '600' },
  notaValue: { fontSize: 17, color: COLORS.text, fontWeight: '700' },
  forecastBox: { backgroundColor: '#FFF7E6', borderRadius: 8, padding: 10, marginBottom: 10 },
  forecastText: { color: COLORS.subtitle, fontSize: 13, textAlign: 'center' },
  statusBox: { borderRadius: 8, padding: 8, marginBottom: 12, alignItems: 'center' },
  statusText: { fontWeight: '700', fontSize: 13 },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  editBtnText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  deleteBtn: { flex: 1, backgroundColor: COLORS.lightRed, borderWidth: 1, borderColor: COLORS.primary, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  deleteBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '95%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.subtitle, marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.text, marginBottom: 14 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  forecastModalBox: { backgroundColor: '#FFF7E6', borderRadius: 12, borderWidth: 1, borderColor: '#F59E0B44', padding: 16, marginBottom: 14, alignItems: 'center' },
  forecastModalTitle: { color: '#B7791F', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  forecastModalDesc: { color: COLORS.subtitle, fontSize: 13, marginBottom: 8 },
  forecastModalValue: { color: COLORS.text, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  forecastFormula: { color: COLORS.subtitle, fontSize: 11, fontStyle: 'italic' },
  resultBox: { borderRadius: 12, borderWidth: 1.5, padding: 16, marginBottom: 14 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-around' },
  resultItem: { alignItems: 'center' },
  resultLabel: { color: COLORS.subtitle, fontSize: 11, textTransform: 'uppercase', fontWeight: '600', marginBottom: 4 },
  resultValue: { fontSize: 20, fontWeight: '800' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 10 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.subtitle, fontWeight: '700' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnText: { color: COLORS.secondary, fontWeight: '700' },
});
