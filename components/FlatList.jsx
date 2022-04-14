import { View, FlatList, StyleSheet, Text, Image, Pressable, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import Feather from "react-native-vector-icons/Feather";
import * as Network from 'expo-network';

export default function FlatListComponent({ navigation, DATA }) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [flatHeight, setFlatHeight] = useState({
    flatContainer: 0,
    flatList: 0,
  })

  const checkNetwork = async (title) => {
    await Network.getNetworkStateAsync().then(res => {
      if (res.isConnected) {
        navigation.navigate('Ligand', { name: title });
      } else {
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
        <Image source={require('../assets/nodata.gif')} resizeMode='contain' style={styles.gif} />
        <Text style={styles.emptyText}>No Ligands Found</Text>
      </View>
    )
  }

  const onLayoutFlatList = (event) => {
    const height = event.nativeEvent.layout.height;
    setFlatHeight({
      ...flatHeight,
      flatList: height,
    })
  }

  const onLayoutContainer = (event) => {
    const height = event.nativeEvent.layout.height;
    setFlatHeight({
      ...flatHeight,
      flatContainer: height,
    })
  }

  useEffect(() => {
    if (flatHeight.flatContainer > 61 * DATA.length || DATA.length <= 0)
      setScrollEnabled(false);
    else
      setScrollEnabled(true);;
  }, [flatHeight, DATA.length])

  return (
    <View style={styles.ligandsContainer} onLayout={onLayoutContainer} >
      {/* {connected === true ? */}
      <FlatList
        onLayout={onLayoutFlatList}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => DATA.indexOf(item)}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {/* //   :
      //   <View style={styles.emptyContainer}>
      //     <Image source={require('../assets/nodata.gif')} resizeMode='contain' style={styles.gif} />
      //     <Text style={styles.emptyText}>No Internet Connection</Text>
      //   </View>
      // } */}
    </View>
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
    paddingHorizontal: 30,
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