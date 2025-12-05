import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryItem } from "./cardCategoryItem";

// Import type từ file cũ

// Danh sách màu để chọn
const COLORS = [
  "#20b2aa",
  "#f44336",
  "#ff9800",
  "#2196f3",
  "#4caf50",
  "#9c27b0",
  "#795548",
  "#607d8b",
];

// Danh sách Icon để chọn
const ICONS = [
  "silverware-fork-knife",
  "train",
  "shopping",
  "pill",
  "school",
  "gamepad-variant",
  "baby-carriage",
  "cat",
  "dumbbell",
  "gift",
  "airplane",
  "gas-station",
  "tools",
  "tshirt-crew",
  "glass-cocktail",
];

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newItem: CategoryItem) => void;
}

export default function AddCategoryModal({
  visible,
  onClose,
  onSave,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleSave = () => {
    if (!name.trim()) return;

    const newItem: CategoryItem = {
      id: Date.now().toString(), // Tạo ID ngẫu nhiên
      name: name,
      icon: selectedIcon,
      library: "MaterialCommunityIcons", // Mặc định dùng bộ này cho dễ
      color: selectedColor,
    };

    onSave(newItem);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Thêm danh mục mới</Text>

          {/* 1. Nhập tên */}
          <Text style={styles.label}>Tên danh mục</Text>
          <View style={[styles.inputContainer, { borderColor: selectedColor }]}>
            <MaterialCommunityIcons
              name={selectedIcon as any}
              size={24}
              color={selectedColor}
            />
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Tiền xăng, Ăn sáng..."
              value={name}
              onChangeText={setName}
              autoFocus={false}
            />
          </View>

          {/* 2. Chọn Màu */}
          <Text style={styles.label}>Chọn màu</Text>
          <View style={styles.selectionRow}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedRing,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* 3. Chọn Icon */}
          <Text style={styles.label}>Chọn biểu tượng</Text>
          <View style={{ height: 120 }}>
            <FlatList
              data={ICONS}
              numColumns={5}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconItem,
                    selectedIcon === item && {
                      backgroundColor: "#f0f0f0",
                      borderColor: selectedColor,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => setSelectedIcon(item)}
                >
                  <MaterialCommunityIcons
                    name={item as any}
                    size={24}
                    color={selectedIcon === item ? selectedColor : "#666"}
                  />
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Nút bấm */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.btnCancel]}
            >
              <Text style={styles.btnTextCancel}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.btn, { backgroundColor: selectedColor }]}
            >
              <Text style={styles.btnTextSave}>Lưu</Text>
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
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  selectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedRing: {
    borderWidth: 3,
    borderColor: "#ddd",
  },
  iconItem: {
    width: "18%", // 5 cột ~ 100% / 5
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: "1%",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnCancel: {
    backgroundColor: "#f0f0f0",
  },
  btnTextSave: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextCancel: {
    color: "#333",
    fontWeight: "bold",
  },
});
