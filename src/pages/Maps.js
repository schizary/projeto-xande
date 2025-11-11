import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "../hooks/useLocation";

export default function Maps({ route }) {
  const { coords, errorMsg } = useLocation();
  
  // Recebe a lista de usuários da navegação
  const usuarios = route.params?.usuarios || [];

  // Array de cores diferentes para cada usuário
  const cores = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
    '#1abc9c', '#d35400', '#34495e', '#e67e22', '#27ae60',
    '#2980b9', '#8e44ad', '#c0392b', '#16a085', '#f1c40f'
  ];

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}> {errorMsg} </Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando localização...</Text>
      </View>
    );
  }

  // Função para obter a cor baseada no índice do usuário
  const getCorUsuario = (index) => {
    return cores[index % cores.length];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {usuarios.length > 0 
            ? `${usuarios.length} usuário(s) no mapa` 
            : 'Nenhum usuário cadastrado'}
        </Text>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {/* Marcador da localização atual */}
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude
          }}
          title="Sua Localização"
          description="Você está aqui"
          pinColor="blue"
        />

        {/* Marcadores dos usuários com cores diferentes */}
        {usuarios.map((usuario, index) => {
          const primeiroNome = usuario.nome.split(' ')[0];
          const corUsuario = getCorUsuario(index);
          
          return (
            <Marker
              key={usuario.id}
              coordinate={usuario.coordenadas}
              title={usuario.nome}
              description={usuario.endereco}
              anchor={{ x: 0.5, y: 1 }} 
            >
              <View style={{ alignItems: "center" }}>
                <View style={[styles.marcador, { backgroundColor: corUsuario }]}>
                  <Text style={styles.textoMarcador}>{primeiroNome}</Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Lista de usuários na parte inferior com cores correspondentes */}
      {usuarios.length > 0 && (
        <View style={styles.listaUsuarios}>
          <Text style={styles.listaTitulo}>Usuários Cadastrados:</Text>
          <ScrollView 
            style={styles.listaScroll}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {usuarios.map((usuario, index) => {
              const corUsuario = getCorUsuario(index);
              
              return (
                <View key={usuario.id} style={styles.usuarioItem}>
                  <View style={[styles.usuarioIndicador, { backgroundColor: corUsuario }]}>
                    <Text style={styles.usuarioNumero}>{index + 1}</Text>
                  </View>
                  <View style={styles.usuarioInfo}>
                    <Text style={styles.usuarioNome} numberOfLines={1}>
                      {usuario.nome}
                    </Text>
                    <Text style={styles.usuarioEndereco} numberOfLines={1}>
                      {usuario.endereco}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    backgroundColor: '#a021bfff',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marcador: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
  textoMarcador: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Estilos para a lista de usuários
  listaUsuarios: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 120,
  },
  listaTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  listaScroll: {
    flexDirection: 'row',
  },
  usuarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 150,
  },
  usuarioIndicador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  usuarioNumero: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  usuarioEndereco: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});