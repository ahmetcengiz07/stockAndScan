import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomModal = ({
  visible,
  title,
  message,
  onClose,
  type = 'success',
  showCancelButton = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                type === 'success'
                  ? 'checkmark-circle'
                  : type === 'warning'
                    ? 'alert-circle'
                    : 'alert-circle'
              }
              size={50}
              color={type === 'success' ? '#20B2AA' : type === 'warning' ? '#FFA500' : '#FF6B6B'}
            />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          <View
            style={[
              styles.buttonContainer,
              showCancelButton && { justifyContent: 'space-between' },
            ]}
          >
            {showCancelButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => onClose(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                type === 'success'
                  ? styles.successButton
                  : type === 'warning'
                    ? styles.warningButton
                    : styles.errorButton,
                showCancelButton ? styles.confirmButton : styles.singleButton,
              ]}
              onPress={() => onClose(true)}
            >
              <Text style={styles.buttonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '45%',
  },
  singleButton: {
    width: '100%',
    maxWidth: 200,
  },
  successButton: {
    backgroundColor: '#20B2AA',
  },
  warningButton: {
    backgroundColor: '#FFA500',
  },
  errorButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    flex: 0,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomModal;
