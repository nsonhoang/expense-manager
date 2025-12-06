import { TextSize } from "@/constants/GlobalValue";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface CardValueMoneyProps {
  money: number;
  updateMoney: (value: number) => void;
}

function CardValueMoney({ money, updateMoney }: CardValueMoneyProps) {
  // 1. Hàm format số thành chuỗi có dấu chấm (VD: 1000 -> 1.000)
  const formatCurrency = (value: number) => {
    if (!value) return "";
    // Dùng Regex để thêm dấu chấm sau mỗi 3 số
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // 2. Hàm xử lý khi người dùng nhập liệu
  const handleChangeText = (text: string) => {
    // Xóa tất cả ký tự KHÔNG PHẢI LÀ SỐ (bao gồm cả dấu chấm nếu user cố nhập)
    const cleanNumber = text.replace(/[^0-9]/g, "");

    // Cập nhật giá trị số nguyên cho cha
    updateMoney(cleanNumber === "" ? 0 : parseInt(cleanNumber, 10));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tiền chi</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor="#999"
        keyboardType="numeric"
        // 3. Hiển thị: Nếu là 0 thì rỗng, ngược lại thì format có dấu chấm
        value={money === 0 ? "" : formatCurrency(money)}
        // 4. Xử lý nhập
        onChangeText={handleChangeText}
      />
      <Text style={styles.icon}>đ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingBottom: 15,
    borderColor: "#e8e8e8",
  },
  label: {
    width: 70,
    fontSize: TextSize.TEXT_DEFAULT || 16,
    color: "#555",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: TextSize.TEXT_DEFAULT || 16,
    backgroundColor: "#e0f7fa",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: "#333", // Thêm màu chữ cho rõ
    fontWeight: "bold", // Tiền thường nên in đậm
  },
  icon: {
    fontSize: TextSize.TEXT_SMALL || 14,
    color: "#555",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default CardValueMoney;
