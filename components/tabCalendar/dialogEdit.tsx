import { FormInput } from "@/app/(app)/(tabs)";
import { Color, TextSize } from "@/constants/GlobalValue";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditTransactionModalProps {
  visible: boolean;
  item: FormInput | null; // Item đang được chọn để sửa
  onClose: () => void;
  onSave: (updatedItem: FormInput) => void;
}

export default function EditTransactionModal({
  visible,
  item,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  // State lưu giá trị đang sửa
  const [moneyStr, setMoneyStr] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");

  // Mỗi khi Modal hiện lên hoặc Item thay đổi -> Load dữ liệu cũ vào form
  useEffect(() => {
    if (item) {
      setMoneyStr(item.money.toString()); // Lưu tạm dưới dạng string để dễ format
      setNote(item.note ?? "");
      setCategory(item.category);
    }
  }, [item, visible]);

  // Xử lý nhập tiền (Format 1.000.000)
  const handleChangeMoney = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, "");
    setMoneyStr(cleanNumber);
  };

  // Hàm Lưu
  const handleSave = () => {
    if (!item) return;

    const updatedItem: FormInput = {
      ...item, // Giữ nguyên các trường cũ (id, date, isExpense...)
      money: parseInt(moneyStr, 10) || 0,
      note: note,
      category: category,
    };

    onSave(updatedItem);
    onClose();
  };

  // Hàm hiển thị tiền có dấu chấm
  const displayMoney = () => {
    if (!moneyStr) return "";
    return moneyStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Chỉnh sửa giao dịch</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.body}>
            {/* 1. Tên Danh Mục (Có thể cho sửa hoặc chỉ hiển thị) */}
            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="shape-outline"
                size={20}
                color={Color.PRIMARY_COLOR}
              />
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Nhập tên danh mục"
              />
            </View>

            {/* 2. Số tiền */}
            <Text style={styles.label}>Số tiền</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={20}
                color={item?.isExpense ? "red" : Color.PRIMARY_COLOR}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.moneyInput,
                  { color: item?.isExpense ? "red" : Color.PRIMARY_COLOR },
                ]}
                value={displayMoney()}
                onChangeText={handleChangeMoney}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.unit}>đ</Text>
            </View>

            {/* 3. Ghi chú */}
            <Text style={styles.label}>Ghi chú</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="note-edit-outline"
                size={20}
                color="#666"
              />
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="Thêm ghi chú..."
              />
            </View>
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={onClose}
            >
              <Text style={styles.textCancel}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSave]}
              onPress={handleSave}
            >
              <Text style={styles.textSave}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", // Căn giữa màn hình (hoặc 'flex-end' nếu muốn trượt từ dưới)
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5, // Bóng đổ Android
    shadowColor: "#000", // Bóng đổ iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  body: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa", // Màu nền xanh nhạt giống App bạn
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: TextSize.TEXT_DEFAULT,
    color: "#333",
    height: "100%",
  },
  moneyInput: {
    fontWeight: "bold",
    fontSize: 18,
  },
  unit: {
    fontSize: 16,
    color: "#888",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#f5f5f5",
  },
  btnSave: {
    backgroundColor: Color.PRIMARY_COLOR, // Màu xanh chủ đạo
  },
  textCancel: {
    color: "#666",
    fontWeight: "600",
  },
  textSave: {
    color: "#fff",
    fontWeight: "bold",
  },
});
