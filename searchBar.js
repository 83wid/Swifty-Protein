import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import axios from "axios";
import { atomsParse } from "./Helpers/atomsParse";
import { connectParse } from "./Helpers/connectParse";



export default function SearchBar({ navigation }) {
    const [ligand, setLigand] = useState('');
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={ligand}
                onChangeText={(text) => {
                    setLigand(text)
                }}
            />
            <Button
                style={styles.input}
                title="Search"
                onPress={() => {
                    const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;
                    axios(url1)
                        .then((res) => {
                            if (res.data) {
                                const data = {atoms: atomsParse(res.data), connects: connectParse(res.data)};
                                navigation.navigate('Protein', data);
                            }
                        })
                        .catch((er) => alert(er));
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        textAlign: "center",
        width: 100,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
