import { View, FlatList, StyleSheet, Text, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef, useContext } from 'react';
import Feather from "react-native-vector-icons/Feather";
import * as Network from 'expo-network';
import { atomsParse } from "../../Helpers/atomsParse";
import { connectParse } from "../../Helpers/connectParse";
import axios from 'axios';
import { LigandContext } from "../../context/state";

export default function FlatListComponent({ navigation, DATA }) {
  const [loading, setLoading] = useState(null);
  const value = useContext(LigandContext);

  const checkNetwork = async (ligand) => {
    await Network.getNetworkStateAsync().then(res => {
      setLoading(true);
      if (res.isConnected) {
        const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
        axios(url1)
          .then((res) => {
            if (res.data) {
              const data = { atoms: atomsParse(res.data), connects: connectParse(res.data) };
              setLoading(false);
              value.state.setLigand(ligand);
              navigation.navigate('Ligand', { name: ligand, data: data });
            }
          })
          .catch((er) => alert(er));
      } else {
        setLoading(null);
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection',
          [{ text: 'OK' }],
        );
      }
    });
  }

  useEffect(() => {
    (async () => {
      await Network.getNetworkStateAsync().then(res => {
        if (res.isConnected === false) {
          Alert.alert(
            'No Internet Connection',
            'Please check your internet connection',
            [{ text: 'OK' }],
          );
        }
      });
    })();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.ligand} onPress={() => checkNetwork(item)}>
        <Text style={styles.title}>{item}</Text>
        <Feather style={styles.icon} name="chevron-right" size={30} color="black" />
      </Pressable>
    )
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../assets/nodata.gif')} resizeMode='contain' style={styles.gif} />
        <Text style={styles.emptyText}>No Ligands Found</Text>
      </View>
    )
  }

  return (
    <>
      {loading && <ActivityIndicator
        size="large"
        color="#fff"
        animating={loading}
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
      />}
      <View style={styles.ligandsContainer} >
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => DATA.indexOf(item)}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  ligandsContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 37,
  },
  ligand: {
    backgroundColor: "#e7eefc",
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 35,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
  },
  icon: {
    marginRight: 10,
  }
})