import { TextSize } from "@/constants/GlobalValue";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Thêm icon cho đẹp
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CalendarButtonProps {
  date: Date;
  updateDate: (date: Date) => void;
}

function CalendarButton({ date, updateDate }: CalendarButtonProps) {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    // Trên Android: đóng picker ngay khi chọn
    // Trên iOS: cần nút "Xong" riêng nếu để trong Modal, hoặc đóng khi chọn tùy logic
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      updateDate(selectedDate);
    }
  };

  // Hàm format ngày tiếng Việt (VD: 04/12/2025)
  const formatDate = (date: any) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {/* Label bên trái */}
      <Text style={styles.label}>Ngày</Text>

      {/* Input hiển thị ngày bên phải - Bấm vào đây để mở Picker */}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.dateDisplayContainer}
      >
        <View style={styles.dateWrapper}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <MaterialCommunityIcons
            name="calendar-month"
            size={20}
            color="#20b2aa"
          />
        </View>
      </TouchableOpacity>

      {/* Xử lý hiển thị Picker */}
      {show &&
        (Platform.OS === "ios" ? (
          // iOS: Bọc trong Modal để không vỡ giao diện chính
          <Modal transparent={true} animationType="slide">
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosHeader}>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Text style={styles.iosDoneText}>Xong</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onChange}
                  textColor="#000"
                />
              </View>
            </View>
          </Modal>
        ) : (
          // Android: Hiển thị trực tiếp (Nó tự bung Popup)
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa theo chiều dọc
    marginBottom: 15, // Khoảng cách giữa các dòng
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderColor: "#e8e8e8",
  },
  label: {
    width: 70, // Cố định chiều rộng nhãn để thẳng hàng
    fontSize: TextSize.TEXT_DEFAULT || 16,
    color: "#555",
    fontWeight: "500",
  },
  dateDisplayContainer: {
    flex: 1, // Chiếm hết phần còn lại bên phải
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e0f7fa", // Màu nền xanh nhạt
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  // Style riêng cho iOS Picker
  iosModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iosPickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  iosHeader: {
    padding: 15,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iosDoneText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CalendarButton;
