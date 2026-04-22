// App.js (na raiz)
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from './src/constants/colors';

// Importando todas as telas que criamos
import Home from './src/screens/Home';
import Forum from './src/screens/Forum';
import PostDetails from './src/screens/PostDetails';
import NewPost from './src/screens/NewPost';
import Profile from './src/screens/Profile';

export default function App() {
  // Estado para controlar qual tela aparece (simulando navegação)
  const [currentScreen, setCurrentScreen] = useState('Home');

  // Função que decide qual componente de tela renderizar
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home': return <Home />;
      case 'Forum': return <Forum />;
      case 'Details': return <PostDetails />; // Adicionado Details
      case 'NewPost': return <NewPost />;     // Adicionado NewPost
      case 'Profile': return <Profile />;     // Adicionado Profile
      case 'Portal': return <Home />;          // Portal simulará a home por enquanto
      default: return <Home />;
    }
  };

  // Título do cabeçalho baseado na tela atual
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'Home': return 'HelpIesb';
      case 'Forum': return 'Fórum';
      case 'Details': return 'Publicação';
      case 'NewPost': return 'Nova Publicação';
      case 'Profile': return 'Meu Perfil';
      case 'Portal': return 'Portal';
      default: return 'HelpIesb';
    }
  };

  // Componente auxiliar para os botões do Footer (para código mais limpo)
  const NavButton = ({ title, icon, screenName }) => (
    <TouchableOpacity style={styles.navButton} onPress={() => setCurrentScreen(screenName)}>
      <Text style={[styles.navIcon, currentScreen === screenName && styles.activeNav]}>{icon}</Text>
      <Text style={[styles.navText, currentScreen === screenName && styles.activeNav]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Cabeçalho Profissional (Vermelho IESB) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
      </View>

      {/* Conteúdo Dinâmico */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Footer / Navegação Inferior (Fiel ao Figma) */}
      <View style={styles.footer}>
        <NavButton title="Início" icon="🏠" screenName="Home" />
        <NavButton title="Fórum" icon="💬" screenName="Forum" />
        <NavButton title="Postar" icon="➕" screenName="NewPost" />
        <NavButton title="Portal" icon="🎓" screenName="Portal" />
        <NavButton title="Perfil" icon="👤" screenName="Profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', paddingTop: 40, elevation: 4 },
  headerTitle: { color: COLORS.secondary, fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  navButton: { alignItems: 'center', flex: 1 },
  navIcon: { fontSize: 20, color: COLORS.subtitle },
  navText: { color: COLORS.subtitle, fontWeight: 'bold', fontSize: 10, marginTop: 2 },
  activeNav: { color: COLORS.primary } // Cor ativa é o Vermelho IESB
});