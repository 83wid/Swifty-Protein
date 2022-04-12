import React, { useRef, useState, useEffect } from 'react';
import { Pressable, AppState, Alert, Button, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

export default function Login({ navigation }) {
  const [compatible, setCompatible] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const isCompatible = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setCompatible(isCompatible && isEnrolled);
    })();
  }, [compatible]);

  const onFaceId = async () => {
    try {
      const type = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (type.includes(1) || type.includes(2)) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Scan your face to continue',
          fallbackLabel: 'Authentication failed, please try again',
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
          fallbackEnabled: false,
          cancelText: 'Cancel',
          fallbackText: 'Fallback',
        });
        if (result.success) {
          setSuccess(true);
          navigation.navigate('Home');
        }
        else
          setSuccess(false);
      }
      else {
        setSuccess(true);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('An error as occured', error?.message);
      setSuccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gifContainer}>
        <Image source={require('../assets/Globe.gif')} resizeMode='contain' style={styles.gif} />
      </View>
      <View style={styles.buttomContainer}>
        <Text style={styles.bigText}>Learn more about Proteins.</Text>
        <Text style={styles.smallText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis scelerisque tellus est, non consectetur sem sollicitudin eu. Nulla vitae nulla a lorem fringilla convallis. Integer ut metus molestie</Text>
        <View style={styles.LoginContainer}>
          {compatible && <Pressable style={styles.BiometricsButton} onPress={onFaceId}>
            <Text style={styles.Biometrics}>Login</Text>
          </Pressable>}
          {!compatible && <Pressable style={styles.GetStartedButton} onPress={onFaceId}>
            <Text style={styles.GetStartedLabel}>Get Started</Text>
          </Pressable>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    color: '#fff',
  },
  gifContainer: {
    width: '90%',
    height: '55%',
  },
  gif: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttomContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    minHeight: height * 0.45,
    width: '100%',
    backgroundColor: '#111111',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
  },
  bigText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 45,
  },
  smallText: {
    color: '#c9c9c9',
    textAlign: 'center',
    lineHeight: 20,
  },
  LoginContainer: {
    position: 'absolute',
    bottom: 35,
    height: "auto",
    width: "100%",
    alignItems: 'center',
  },
  BiometricsButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    minHeight: 55,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  Biometrics: {
    fontSize: 20,
    fontWeight: "500",
  },
  GetStartedButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    minHeight: 55,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  GetStartedLabel: {
    fontSize: 20,
    fontWeight: "500",
  },
});