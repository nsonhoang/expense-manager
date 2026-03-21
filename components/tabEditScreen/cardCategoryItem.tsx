import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIES } from "../categoryIcons";
import AddCategoryModal from "./dialogAddCategory";

// Định nghĩa kiểu dữ liệu cho danh mục
export type CategoryItem = {
  id: string;
  name: string;
  icon?: any; // Tên icon
  library?: "MaterialCommunityIcons" | "FontAwesome5" | "Ionicons";
  color: string;
  isEditButton?: boolean;
};
// Props nhận vào (nếu muốn điều khiển từ component cha)
interface CategoryGridProps {
  initialSelectedId?: string;
  onSelectCategory?: (category: string) => void;
}

const STORAGE_KEY = "@category_list_data";

const { width } = Dimensions.get("window");
// Tính toán kích thước item: (Màn hình - Padding 2 bên) / 4 cột
// const ITEM_WIDTH = (width - 32) / 4;
// const ITEM_HEIGHT = ITEM_WIDTH; // Hình vuông

function CardCategoryItem({
  initialSelectedId = "",
  onSelectCategory,
}: CategoryGridProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [incomeList, setIncomeList] = useState<CategoryItem[]>(CATEGORIES);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Cập nhật selectedId nếu props thay đổi
  useEffect(() => {
    if (initialSelectedId) setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  // Hàm đọc dữ liệu từ máy
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        // Nếu có dữ liệu cũ -> Lấy ra dùng
        setIncomeList(JSON.parse(jsonValue));
      } else {
        // Nếu chưa có (lần đầu tải app) -> Dùng mặc định
        setIncomeList(CATEGORIES);
      }
    } catch (e) {
      console.log("Lỗi đọc dữ liệu:", e);
    }
  };

  const handledEdit = () => {
    setModalVisible(true);
  };

  const saveData = async (newList: CategoryItem[]) => {
    try {
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log("Lỗi lưu dữ liệu:", e);
    }
  };
  const handleSaveNewCategory = (newItem: CategoryItem) => {
    const listCopy = [...incomeList];
    // Chèn vào vị trí kế cuối
    listCopy.splice(listCopy.length - 1, 0, newItem);

    setIncomeList(listCopy); // Cập nhật giao diện
    saveData(listCopy); // 3. Gọi hàm LƯU vào bộ nhớ máy

    setModalVisible(false);
  };

  const handlePress = (item: CategoryItem) => {
    if (item.isEditButton) {
      handledEdit();
      return;
    }
    if (onSelectCategory) {
      setSelectedId(item.id);
      onSelectCategory(item.name);
    }
  };

  const renderIcon = (item: CategoryItem, isSelected: boolean) => {
    // Nếu không chọn thì dùng màu của item, nếu chọn thì vẫn giữ màu đó (hoặc đổi logic tùy ý)
    const iconColor = item.color;
    const size = 28;

    if (item.library === "FontAwesome5") {
      return <FontAwesome5 name={item.icon} size={size} color={iconColor} />;
    } else if (item.library === "Ionicons") {
      return <Ionicons name={item.icon} size={size} color={iconColor} />;
    }
    // Mặc định dùng MaterialCommunityIcons
    return (
      <MaterialCommunityIcons name={item.icon} size={size} color={iconColor} />
    );
  };

  return (
    <View style={styles.container}>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNewCategory}
      />
      <Text style={styles.headerTitle}>Danh mục</Text>

      <View style={styles.gridContainer}>
        {incomeList.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemContainer,
                // Style động khi được chọn
                isSelected ? styles.itemSelected : styles.itemNormal,
              ]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {renderIcon(item, isSelected)}
              </View>
              <Text
                style={[
                  styles.itemName,
                  // Nếu text quá dài có thể chỉnh style tại đây
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0, // React Native mới hỗ trợ gap, hoặc dùng margin âm nếu bản cũ
    justifyContent: "center",
  },
  itemContainer: {
    width: (width - 32) / 5, // Trừ đi khoảng cách giữa các item (ước lượng)
    height: (width - 32) / 5,
    margin: 3, // Khoảng cách giữa các ô
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  // Trạng thái bình thường
  itemNormal: {
    borderWidth: 1,
    borderColor: "#e0e0e0", // Màu viền xám nhạt
  },
  // Trạng thái ĐƯỢC CHỌN (Giống ảnh)
  itemSelected: {
    borderWidth: 1.5, // Viền dày hơn
    borderColor: "#20b2aa", // Màu xanh Teal
    backgroundColor: "#f0fffe", // Nền xanh rất nhạt
  },
  iconWrapper: {
    marginBottom: 5,
  },
  itemName: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 2,
  },
});

export default CardCategoryItem;
