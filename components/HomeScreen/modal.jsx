import { View, StyleSheet, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import Modal from 'react-native-modal';
import axios from 'axios';
import { LigandContext } from '../../context/state';
import XMLParser from 'react-xml-parser';
import * as Linking from 'expo-linking';
import Ionicons from "react-native-vector-icons/Ionicons";

const AtomDetail = ({ DataType, DataValue, AddedStyle }) => {
  return (
    <View style={AddedStyle}>
      <Text style={{ fontSize: 7, color: "#7F7F7F" }}>{DataType}</Text>
      <Text style={{ marginLeft: 4, }}>{DataValue}</Text>
    </View>
  )
}

export default function BottomHalfModal() {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = () => setIsModalVisible(false);
  const openModal = () => setIsModalVisible(true);
  const value = useContext(LigandContext);
  const ligand = value.state.ligand;

  const [ligandDetail, setLigandDetail] = useState([])

  useEffect(() => {
    const url2 = `https://files.rcsb.org/ligands/${ligand[0]}/${ligand}/${ligand}.xml`;
    axios(url2)
      .then((res) => {
        if (res.data) {
          var xml = new XMLParser().parseFromString(res.data); // parse the XML
          const ligandDetail = {
            type: xml.getElementsByTagName('PDBx:type')[0].value || 'Unknown',
            formula: xml.getElementsByTagName('PDBx:formula')[0].value || 'Unknown',
            formula_weight: xml.getElementsByTagName('PDBx:formula_weight')[0].value || 'Unknown',
            three_letter_code: xml.getElementsByTagName('PDBx:three_letter_code')[0].value || 'Unknown',
          }
          setLigandDetail(ligandDetail)
        }
      })
  }, [ligand])

  useEffect(() => {
    setTimeout(() => {
      closeModal();
    }, 3000);
  }, [])

  return (
    <>
      <SafeAreaView style={{
        position: "absolute",
        bottom: 20,
        left: 25,
        zIndex: 2,
      }}>
        <View
          style={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <TouchableOpacity onPress={openModal}>
            <View
              style={{
                backgroundColor: "#D8D8D8",
                width: 40,
                height: 40,
                fontSize: 20,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-up" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal
        testID={'modal'}
        isVisible={isModalVisible}
        onSwipeComplete={closeModal}
        hasBackdrop={false}
        coverScreen={false}
        swipeDirection={['left', 'right']}
        style={styles.view}
      >
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                // justifyContent: 'space-evenly',
                justifyContent: 'center',
                width: '45%',
              }}
            >
              <AtomDetail
                DataType={'Symbol'}
                DataValue={ligandDetail.three_letter_code}
                AddedStyle={{ marginBottom: 10 }}
              />
              <AtomDetail
                DataType={'Formula'}
                DataValue={ligandDetail.formula}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                // justifyContent: 'space-evenly',
                justifyContent: 'center',
                width: '45%',
              }}
            >
              <AtomDetail
                DataType={'Type'}
                DataValue={ligandDetail.type}
                AddedStyle={{ marginBottom: 10 }}
              />
              <AtomDetail
                DataType={'Formula Weight'}
                DataValue={parseFloat(ligandDetail.formula_weight).toFixed(2)}
              />
            </View>

          </View>
          <Button
            title="See More Details"
            onPress={() => {
              Linking.openURL(`https://www.rcsb.org/ligand/${ligand}`);
            }}
          ></Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  content: {
    borderRadius: 18,
    backgroundColor: 'white',
    paddingVertical: 12,
  }
});
