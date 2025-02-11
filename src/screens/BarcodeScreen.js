import { useFocusEffect } from '@react-navigation/native';
import React, { useRef, useState, useCallback } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const BarcodeScreen = () => {
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const [key, setKey] = useState(0);

  // Ekran her odaklandığında çalışacak
  useFocusEffect(
    useCallback(() => {
      // Ekrana her geldiğimizde kamerayı sıfırla
      const resetCamera = () => {
        setZoom(0);
        setKey(prevKey => prevKey + 1);
        if (cameraRef.current) {
          cameraRef.current.resumePreview();
        }
      };

      resetCamera();

      // Ekrandan ayrılırken cleanup
      return () => {
        if (cameraRef.current) {
          cameraRef.current.pausePreview();
        }
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Camera
        key={key}
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        zoom={zoom}
        ratio="16:9"
      />
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => {
          setZoom(0);
          setKey(prevKey => prevKey + 1);
          if (cameraRef.current) {
            cameraRef.current.resumePreview();
          }
        }}
      >
        <Text style={styles.resetText}>Kamerayı Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  resetButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 8,
  },
  resetText: {
    color: 'white',
    fontSize: 16,
  }
}); 