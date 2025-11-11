import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput,
  ScrollView,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';

const Main = () => {
  const navigation = useNavigation();
  
  // Estado para o formulário
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  // Estado para armazenar usuários cadastrados
  const [usuarios, setUsuarios] = useState([]);
  const [permissaoConcedida, setPermissaoConcedida] = useState(false);

  // Solicitar permissão de localização ao carregar o componente
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setPermissaoConcedida(true);
        } else {
          Alert.alert(
            'Permissão Negada',
            'Precisamos de permissão de localização para converter endereços em coordenadas.'
          );
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
        Alert.alert('Erro', 'Não foi possível solicitar permissão de localização');
      }
    })();
  }, []);

  const handleCadastrarUsuario = async () => {
    if (!nome || !rua || !numero || !cidade || !estado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Verificar se a permissão foi concedida
    if (!permissaoConcedida) {
      Alert.alert(
        'Permissão Necessária',
        'É necessário conceder permissão de localização para cadastrar usuários.'
      );
      return;
    }

    try {
      const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}`;
      
      // Geocodificação do endereço
      const locationResult = await Location.geocodeAsync(enderecoCompleto);
      
      if (locationResult && locationResult.length > 0) {
        const { latitude, longitude } = locationResult[0];
        
        const novoUsuario = {
          id: Date.now().toString(),
          nome,
          endereco: enderecoCompleto,
          coordenadas: {
            latitude,
            longitude
          }
        };

        // Adiciona o usuário à lista
        setUsuarios(prevUsuarios => [...prevUsuarios, novoUsuario]);
        
        // Limpa o formulário
        setNome('');
        setRua('');
        setNumero('');
        setCidade('');
        setEstado('');
        
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      } else {
        Alert.alert('Erro', 'Endereço não encontrado. Verifique os dados.');
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      Alert.alert('Erro', 'Não foi possível encontrar o endereço. Verifique a conexão ou tente outro endereço.');
    }
  };

  const handleMaps = () => {
    // Passa a lista de usuários para a tela Maps
    navigation.navigate("Maps", { usuarios });
  };

  const handleGrafic = () => {
    navigation.navigate("Graficos");
  };

  const handleCamera = () => {
    navigation.navigate("Camera");
  };

  const solicitarPermissaoNovamente = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissaoConcedida(true);
        Alert.alert('Sucesso', 'Permissão concedida!');
      } else {
        Alert.alert('Permissão Negada', 'A permissão de localização é necessária para o funcionamento do app.');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuários</Text>
      
      {/* Status da Permissão */}
      {!permissaoConcedida && (
        <View style={styles.permContainer}>
          <Text style={styles.permText}>Permissão de localização necessária</Text>
          <TouchableOpacity style={styles.permButton} onPress={solicitarPermissaoNovamente}>
            <Text style={styles.permButtonText}>Conceder Permissão</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Formulário de Cadastro */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={rua}
          onChangeText={setRua}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.flex2]}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Estado (ex: SP, RJ)"
          value={estado}
          onChangeText={setEstado}
          maxLength={2}
          autoCapitalize="characters"
        />
        
        <TouchableOpacity 
          style={[
            styles.cadastrarButton, 
            !permissaoConcedida && styles.buttonDisabled
          ]} 
          onPress={handleCadastrarUsuario}
          disabled={!permissaoConcedida}
        >
          <Text style={styles.buttonText}>
            {permissaoConcedida ? 'Cadastrar Usuário' : 'Aguardando Permissão'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Usuários cadastrados: {usuarios.length}
        </Text>
        {usuarios.length > 0 && (
          <Text style={styles.subInfoText}>
            Toque em "Ver Mapa" para visualizar no mapa
          </Text>
        )}
      </View>

      {/* Botões de Navegação */}
      <TouchableOpacity 
        style={[
          styles.button, 
          (usuarios.length === 0 || !permissaoConcedida) && styles.buttonDisabled
        ]} 
        onPress={handleMaps}
        disabled={usuarios.length === 0 || !permissaoConcedida}
      >
        <Text style={styles.buttonText}>
          Ver Mapa com Usuários ({usuarios.length})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  permContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "#ffeaa7",
    borderWidth: 1,
  },
  permText: {
    fontSize: 16,
    color: "#856404",
    textAlign: "center",
    marginBottom: 10,
  },
  permButton: {
    padding: 10,
    backgroundColor: "#ffc107",
    borderRadius: 5,
    alignItems: "center",
  },
  permButtonText: {
    color: "#856404",
    fontWeight: "bold",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
    marginRight: 10,
  },
  flex2: {
    flex: 2,
  },
  cadastrarButton: {
    padding: 15,
    backgroundColor: "#27ae60",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#a021bfff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  subInfoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
});